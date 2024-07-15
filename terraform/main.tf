data "azurerm_resource_group" "rg_env" {
  name = "rg-${var.environment}-${var.project_short_name}"
}

resource "azurerm_storage_account" "default" {
  name                      = "sa${var.project_short_name}${var.environment}"
  resource_group_name       = data.azurerm_resource_group.rg_env.name
  location                  = data.azurerm_resource_group.rg_env.location
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  enable_https_traffic_only = true

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }

  tags = {
    description = "Managed by Terraform"
    environment = var.environment
  }
}

resource "azurerm_cdn_profile" "default" {
  name                = "cdnp-${var.environment}-${var.project_short_name}"
  resource_group_name = data.azurerm_resource_group.rg_env.name
  location            = data.azurerm_resource_group.rg_env.location
  sku                 = "Standard_Microsoft"

  tags = {
    description = "Managed by Terraform"
    environment = var.environment
  }
}

resource "azurerm_cdn_endpoint" "default" {
  name                          = "cdne-${var.environment}-${var.project_short_name}"
  profile_name                  = azurerm_cdn_profile.default.name
  location                      = data.azurerm_resource_group.rg_env.location
  resource_group_name           = data.azurerm_resource_group.rg_env.name
  optimization_type             = "GeneralWebDelivery"
  querystring_caching_behaviour = "UseQueryString"
  origin_host_header            = replace(azurerm_storage_account.default.primary_web_host, "https://", "")

  origin {
    name       = var.project_short_name
    host_name  = replace(azurerm_storage_account.default.primary_web_host, "https://", "")
    https_port = "443"
  }

  delivery_rule {
    name  = "EnforceHTTPS"
    order = 1

    request_scheme_condition {
      match_values     = ["HTTP", ]
      negate_condition = "false"
      operator         = "Equal"
    }

    url_redirect_action {
      protocol      = "Https"
      redirect_type = "Found"
    }
  }

  delivery_rule {
    name  = "SPArewrite"
    order = 2

    url_file_extension_condition {
      operator     = "LessThan"
      match_values = ["1"]
    }

    request_uri_condition {
      operator         = "Equal"
      match_values     = ["/404"]
      negate_condition = "true"
    }

    url_rewrite_action {
      source_pattern          = "/"
      destination             = "/index.html"
      preserve_unmatched_path = false
    }
  }

  delivery_rule {
    name  = "SecurityHeader"
    order = 3

    modify_response_header_action {
      action = "Append"
      name   = "X-Frame-Options"
      value  = "DENY"
    }

    modify_response_header_action {
      action = "Append"
      name   = "Strict-Transport-Security"
      value  = "max-age=31536000; includeSubDomains"
    }

    modify_response_header_action {
      action = "Append"
      name   = "X-Content-Type-Options"
      value  = "nosniff"
    }

    request_uri_condition {
      operator = "Any"
    }
  }

  tags = {
    description = "Managed by Terraform"
    environment = var.environment
  }
}
