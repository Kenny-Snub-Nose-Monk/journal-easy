'use client'

import { useEffect, useState } from 'react'

export default function useDocAuthority(
  id: string,
  curUserId: string,
  docUserId: string,
  sharePassword: string
) {
  const [authority, setAuthority] = useState(curUserId === docUserId)
  const [UnauthorizedText, setUnauthorizedText] = useState('共享權限校驗中...')

  useEffect(() => {
    if (authority) return

    const STORAGE_KEY = `SHARED_PASSWORD_${id}`
    if (localStorage.getItem(STORAGE_KEY) === sharePassword) {
      setAuthority(true)
      return
    }

    // If there is no password in localStorage or not correct, get it
    const p = prompt('請輸入共享密碼：')
    if (!p?.trim() || p !== sharePassword) {
      setUnauthorizedText('密碼錯誤，請刷新頁面重試')
      return
    }
    if (p === sharePassword) {
      localStorage.setItem(STORAGE_KEY, p)
      setAuthority(true)
    }
  }, [id, authority, sharePassword])

  return { authority, UnauthorizedText }
}
