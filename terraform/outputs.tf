output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.web.name
}

output "storage_account_id" {
  description = "ID of the storage account"
  value       = azurerm_storage_account.web.id
}

output "storage_primary_web_endpoint" {
  description = "Primary web endpoint of the storage account (direct access)"
  value       = azurerm_storage_account.web.primary_web_endpoint
}

output "storage_primary_web_host" {
  description = "Primary web host of the storage account"
  value       = azurerm_storage_account.web.primary_web_host
}

output "frontdoor_profile_id" {
  description = "Azure Front Door Profile ID"
  value       = azurerm_cdn_frontdoor_profile.main.id
}

output "frontdoor_endpoint_hostname" {
  description = "Azure Front Door endpoint hostname"
  value       = azurerm_cdn_frontdoor_endpoint.web.host_name
}

output "frontdoor_endpoint_url" {
  description = "Full URL to access the website via Front Door (use this)"
  value       = "https://${azurerm_cdn_frontdoor_endpoint.web.host_name}"
}
