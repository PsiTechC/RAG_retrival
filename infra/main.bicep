@description('Deployment location (must equal the Container Apps Environment region)')
param location string

param caeName         string
param caName          string
param acrName         string
param kvName          string
param imageRepo       string
param imageTag        string

@description('CPU cores for the container')
param cpu int = 2

@description('Memory for the container (e.g., 4Gi or 8Gi)')
param memory string = '4Gi'

@description('Minimum replicas to keep running')
param minReplicas int = 1

@description('Maximum replicas allowed')
param maxReplicas int = 10

@description('Array of secret mappings (Key Vault secret -> ACA secret -> env var)')
param secretMappings array

resource acr 'Microsoft.ContainerRegistry/registries@2023-11-01-preview' existing = {
  name: acrName
}
resource kv  'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: kvName
}
resource cae 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: caeName
}

@description('Container App')
resource app 'Microsoft.App/containerApps@2024-03-01' = {
  name: caName
  location: location   

  identity: {
    type: 'SystemAssigned'
  }

  properties: {
    managedEnvironmentId: cae.id

    configuration: {
      registries: [
        {
          server: '${acr.name}.azurecr.io'
        }
      ]
      secrets: [
        for s in secretMappings: {
          name: s.secretName
          keyVaultUrl: 'https://${kv.name}${environment().suffixes.keyvaultDns}/secrets/${s.kvSecretName}'
          identity: 'system'
        }
      ]
      ingress: {
        external: true
        targetPort: 9000
      }
    }

    template: {
      containers: [
        {
          name: caName
          image: '${acr.name}.azurecr.io/${imageRepo}:${imageTag}'
          env: [
            for s in secretMappings: {
              name: s.envName
              secretRef: s.secretName
            }
          ]
          resources: {
            cpu: cpu
            memory: memory
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
      }
      revisionSuffix: imageTag
    }
  }
}

// Allow the Container App to pull images from ACR
resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().id, acr.id, 'AcrPull', app.name)
  scope: acr
  properties: {
    principalId: app.identity.principalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions','7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalType: 'ServicePrincipal'
  }
}

// Allow the Container App to read secrets from Key Vault
resource kvSecretsGet 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().id, kv.id, 'KVSecretsUser', app.name)
  scope: kv
  properties: {
    principalId: app.identity.principalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions','4633458b-17de-408a-b874-0445c86b69e6')
    principalType: 'ServicePrincipal'
  }
}
