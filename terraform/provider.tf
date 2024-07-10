
data "azurerm_resource_group" "rg_global" {
  name = "rg-global-${var.project_short_name}"
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.111.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = data.azurerm_resource_group.rg_global.name
    storage_account_name = "wrstfstorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}
