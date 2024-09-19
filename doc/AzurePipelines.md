# Azure Pipelines

## Pipeline Code

This project uses CI/CD pipelines that are implemented as yaml code.
They are declared in the following files.

- `azure-pipelines.yml`

These pipelines are divided in parameterized stages that are defined accross several files, all located under [`azure-pipleine/`](../azure-pipeline/).
The more complex stages are also divided into several steps files, again all located under the azure-pipeline folder.

## Azure setup

### Global ressource group

The following needs to be setup in azure before any deployment can be done:

- A resource group named "rg-global-<project_short_name>"
- A storage account with a container
  - Make sure all names are properly setup in the provider.tf file

This global resource group is where we will store the terraform state.

### Ressource groups for each deployment environment

The pipeline is setup to run as a loop for multiple environments (look at the environments parameter in file [`azure-pipleine/`](../azure-pipeline/environments_loop.yml)). A ressource group has to be manually created beforehand for each environment, matching the environment name declared in the main.tf file, `"rg-<environment>-<project_short_name>"`.

## Azure devops setup

### Pipeline Library

You must create a couple of libraries where some variables needed by the pipeline will be stored.

- web-react-skeleton-azure (to store "global" values that won't change between each environment)
  - ARM_SERVICE_CONNECTION_NAME
  - PROJECT_SHORT_NAME
- web-react-skeleton-\<env> (for environment specific values, like the API URL or a Google Analytics key)

### Service connection

Under `Project settings` -> `Pipelines`, go to service connections.

Select `Azure resource manager` and then `Workload Identity federation (automatic)`. Make sure the service connection name matches ARM_SERVICE_CONNECTION_NAME from the library. **Do not select a resource group** (this will allow the service connection to create resources on all resource groups).

## Possible issues

When running the pipeline, if you get the following error:

`Message="The subscription is not registered to use namespace 'Microsoft.Cdn'.`

You can connect to the cloud shell on the azure portal and run the following command:

`az provider register --namespace Microsoft.Cdn`
