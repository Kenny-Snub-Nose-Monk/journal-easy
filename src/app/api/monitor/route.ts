import { genSuccessData } from '@/app/api/utils/gen-res-data'

// Liveness reports no private document data.
export async function POST() {
  return Response.json(genSuccessData({ status: 'ok' }))
}
