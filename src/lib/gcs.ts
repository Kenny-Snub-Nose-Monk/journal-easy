import { Storage } from '@google-cloud/storage'

export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: './key.json',
})

export const bucket = storage.bucket(
  process.env.GOOGLE_CLOUD_BUCKET_NAME as string
)

// 添加驗證代碼
// async function validateBucket() {
//   try {
//     const [exists] = await bucket.exists()
//     if (!exists) {
//       console.error(
//         'Bucket does not exist:',
//         process.env.GOOGLE_CLOUD_BUCKET_NAME
//       )
//       console.error('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID)
//     } else {
//       console.log('Bucket validated successfully')
//     }
//   } catch (error) {
//     console.error('Bucket validation error:', error)
//   }
// }

// 在開發環境中運行驗證
// if (process.env.NODE_ENV === 'development') {
//   validateBucket()
// }
