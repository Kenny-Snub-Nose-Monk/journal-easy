'use client'

import { useState, useEffect } from 'react'
import { getHourStamp } from '@/lib/utils'

export default function QRCode() {
  const [hide, setHide] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setHide(false)
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  if (hide) return null

  return (
    <div className="max-w-[300px]">
      <div>
        <img
          src={`https://file-dev.huashuiai.com/static-home/qr.JPG?r=${getHourStamp()}`}
          className="w-full"
          alt="QR Code"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        失敗可vx: <code>fe-wfp</code> ,備註: 划水群
      </p>
    </div>
  )
}
