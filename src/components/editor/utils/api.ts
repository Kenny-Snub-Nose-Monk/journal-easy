export async function uploadImageAPI() {
  // TODO 模擬圖片上傳，以後會傳到 OSS
  await new Promise((r) => setTimeout(r, 500))
  return 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Liu_Yifei_at_the_2016_BAZAAR_Stars%E2%80%99_Charity_Night.jpg'
}
