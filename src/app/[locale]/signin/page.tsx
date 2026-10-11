'use client'
import { useEffect, useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import HomeNav from '@/components/home-nav'
import { useTranslations } from 'next-intl'

export default function SignInPage() {
  const t = useTranslations('signin')
  const [providers, setProviders] = useState<Awaited<ReturnType<typeof getProviders>>>(null)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    void getProviders().then(setProviders)
  }, [])
  async function login(provider: string) {
    setPending(true)
    setError('')
    try {
      const callback = new URLSearchParams(window.location.search).get('callbackUrl')
      const callbackUrl = callback?.startsWith('/') && !callback.startsWith('//') ? callback : '/work'
      const result = await signIn(provider, { password, email, callbackUrl, redirect: provider !== 'local' })
      if (result?.error) setError('登入失敗 / Sign-in failed')
      else if (provider === 'local') window.location.assign(callbackUrl)
    } catch {
      setError('登入失敗 / Sign-in failed')
    } finally {
      setPending(false)
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <HomeNav />
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        {providers?.local && (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              void login('local')
            }}
          >
            <label htmlFor="local-password">密碼 / Password</label>
            <Input
              id="local-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={pending}>
              登入 / Sign in
            </Button>
          </form>
        )}
        {providers?.github && (
          <Button disabled={pending} onClick={() => void login('github')}>
            {t('withGithub')}
          </Button>
        )}
        {providers?.nodemailer && (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              void login('nodemailer')
            }}
          >
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" disabled={pending}>
              {t('withEmail')}
            </Button>
          </form>
        )}
        {providers && !Object.keys(providers).length && <p>尚未設定登入方式 / Sign-in is not configured.</p>}
        {error && (
          <p role="alert" className="text-red-500">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}
