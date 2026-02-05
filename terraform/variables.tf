# Terraform Variables

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment name (dev, qa, uat, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "qa", "uat", "prod"], var.environment)
    error_message = "Environment must be one of: dev, qa, uat, prod."
  }
}

variable "project_short_name" {
  description = "Short name for the project used in resource naming (lowercase, no special chars)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9]{3,10}$", var.project_short_name))
    error_message = "Project short name must be 3-10 lowercase alphanumeric characters."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "canadacentral"
}

variable "frontdoor_sku" {
  description = "Azure Front Door SKU (Standard_AzureFrontDoor or Premium_AzureFrontDoor)"
  type        = string
  default     = "Standard_AzureFrontDoor"

  validation {
    condition     = contains(["Standard_AzureFrontDoor", "Premium_AzureFrontDoor"], var.frontdoor_sku)
    error_message = "Front Door SKU must be Standard_AzureFrontDoor or Premium_AzureFrontDoor."
  }
}
