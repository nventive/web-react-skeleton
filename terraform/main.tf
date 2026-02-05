locals {
  resource_prefix = "${var.project_short_name}-${var.environment}"
  # Storage account names must be 3-24 chars, lowercase alphanumeric only
  storage_account_name = substr(replace("st${var.project_short_name}${var.environment}", "-", ""), 0, 24)

  tags = {
    Environment = var.environment
    Project     = var.project_short_name
    ManagedBy   = "Terraform"
  }

  # Content types for CDN compression
  compressed_content_types = [
    "application/javascript",
    "application/json",
    "application/xml",
    "application/wasm",
    "text/css",
    "text/html",
    "text/javascript",
    "text/plain",
    "text/xml",
    "image/svg+xml",
    "font/woff",
    "font/woff2"
  ]
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}"
  location = var.location
  tags     = local.tags
}

# Storage Account for Static Website
resource "azurerm_storage_account" "web" {
  name                          = local.storage_account_name
  resource_group_name           = azurerm_resource_group.main.name
  location                      = azurerm_resource_group.main.location
  account_tier                  = "Standard"
  account_replication_type      = "LRS"
  account_kind                  = "StorageV2"
  min_tls_version               = "TLS1_2"
  https_traffic_only_enabled    = true
  public_network_access_enabled = true
  tags                          = local.tags

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html" # SPA fallback for React Router
  }

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD", "OPTIONS"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

# Azure Front Door Profile
resource "azurerm_cdn_frontdoor_profile" "main" {
  name                = "afd-${local.resource_prefix}"
  resource_group_name = azurerm_resource_group.main.name
  sku_name            = var.frontdoor_sku
  tags                = local.tags
}

# Front Door Endpoint
resource "azurerm_cdn_frontdoor_endpoint" "web" {
  name                     = "ep-${local.resource_prefix}"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  enabled                  = true
  tags                     = local.tags
}

# Front Door Origin Group
resource "azurerm_cdn_frontdoor_origin_group" "web" {
  name                     = "og-web"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  session_affinity_enabled = false

  load_balancing {
    sample_size                        = 4
    successful_samples_required        = 3
    additional_latency_in_milliseconds = 50
  }

  health_probe {
    path                = "/"
    request_type        = "HEAD"
    protocol            = "Https"
    interval_in_seconds = 100
  }
}

# Front Door Origin (Storage Account)
resource "azurerm_cdn_frontdoor_origin" "web" {
  name                          = "origin-storage"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.web.id
  enabled                       = true

  certificate_name_check_enabled = true
  host_name                      = azurerm_storage_account.web.primary_web_host
  origin_host_header             = azurerm_storage_account.web.primary_web_host
  http_port                      = 80
  https_port                     = 443
  priority                       = 1
  weight                         = 1000
}

# Front Door Route
resource "azurerm_cdn_frontdoor_route" "web" {
  name                          = "route-web"
  cdn_frontdoor_endpoint_id     = azurerm_cdn_frontdoor_endpoint.web.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.web.id
  cdn_frontdoor_origin_ids      = [azurerm_cdn_frontdoor_origin.web.id]

  enabled                = true
  supported_protocols    = ["Http", "Https"]
  patterns_to_match      = ["/*"]
  forwarding_protocol    = "HttpsOnly"
  link_to_default_domain = true
  https_redirect_enabled = true

  cache {
    query_string_caching_behavior = "UseQueryString"
    compression_enabled           = true
    content_types_to_compress     = local.compressed_content_types
  }
}

# Front Door Security Policy with WAF (only for Premium SKU)
resource "azurerm_cdn_frontdoor_firewall_policy" "waf" {
  count = var.frontdoor_sku == "Premium_AzureFrontDoor" ? 1 : 0

  name                              = "wafpolicy${replace(local.resource_prefix, "-", "")}"
  resource_group_name               = azurerm_resource_group.main.name
  sku_name                          = var.frontdoor_sku
  enabled                           = true
  mode                              = "Prevention"
  custom_block_response_status_code = 403
  tags                              = local.tags

  managed_rule {
    type    = "Microsoft_DefaultRuleSet"
    version = "2.1"
    action  = "Block"
  }

  managed_rule {
    type    = "Microsoft_BotManagerRuleSet"
    version = "1.0"
    action  = "Block"
  }
}

resource "azurerm_cdn_frontdoor_security_policy" "waf" {
  count = var.frontdoor_sku == "Premium_AzureFrontDoor" ? 1 : 0

  name                     = "secpolicy-waf"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id

  security_policies {
    firewall {
      cdn_frontdoor_firewall_policy_id = azurerm_cdn_frontdoor_firewall_policy.waf[0].id

      association {
        patterns_to_match = ["/*"]

        domain {
          cdn_frontdoor_domain_id = azurerm_cdn_frontdoor_endpoint.web.id
        }
      }
    }
  }
}
