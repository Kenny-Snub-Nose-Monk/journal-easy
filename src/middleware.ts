import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  if (viewport === 'desktop' || url.pathname.startsWith('/mobile')) {
    // 是 PC 端，或者已经在 mobile 页面，则直接访问
    return NextResponse.next()
  }

  // 否则（移动端浏览器，访问其他页面），重定向到 mobile 页面
  return NextResponse.redirect(url.origin + '/mobile')
}
