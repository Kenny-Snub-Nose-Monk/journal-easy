'use client'
export default function UpdateTime({ dt }: { dt: Date }) {
  // 在客户端顯示時間，服務端時區可能不同
  return <span className="text-gray-500">{dt.toLocaleString()}</span>
}
