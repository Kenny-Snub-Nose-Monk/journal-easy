import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

export async function getSecret(secretName: string) {
  const client = new SecretManagerServiceClient()
  const name = `projects/${process.env.PROJECT_ID}/secrets/${secretName}/versions/latest`

  try {
    const [version] = await client.accessSecretVersion({ name })
    return version.payload?.data?.toString()
  } catch (err) {
    console.error(`Error accessing secret ${secretName}:`, err)
    return null
  }
}
