import { getSecret } from '@/lib/secrets'
import { NextResponse } from 'next/server'

export async function GET() {
  // 數據庫相關
  const databaseUrl = await getSecret('DATABASE_URL')

  // NextAuth 相關
  const authSecret = await getSecret('AUTH_SECRET')
  const authGithubId = await getSecret('AUTH_GITHUB_ID')
  const authGithubSecret = await getSecret('AUTH_GITHUB_SECRET')

  // Email 相關
  const emailServer = await getSecret('EMAIL_SERVER')
  const emailFrom = await getSecret('EMAIL_SERVER_FROM')
  const nextAuthUrl = await getSecret('NEXTAUTH_URL')

  // Google Cloud 相關
  const googleCloudProjectId = await getSecret('GOOGLE_CLOUD_PROJECT_ID')
  const googleCloudBucketName = await getSecret('GOOGLE_CLOUD_BUCKET_NAME')
  const imageProcessorUrl = await getSecret('NEXT_PUBLIC_IMAGE_PROCESSOR_URL')

  // TipTap 相關
  const tiptapProToken = await getSecret('TIPTAP_PRO_TOKEN')

  return NextResponse.json({
    databaseUrl,
    authSecret,
    authGithubId,
    authGithubSecret,
    emailServer,
    emailFrom,
    nextAuthUrl,
    googleCloudProjectId,
    googleCloudBucketName,
    imageProcessorUrl,
    tiptapProToken,
  })
}
