import NextAuth, { type NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { type Adapter } from 'next-auth/adapters'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import Email from 'next-auth/providers/nodemailer'
import { createHash, timingSafeEqual } from 'node:crypto'
import { db } from '@/db/db'

const ownerEmail = (process.env.OWNER_EMAIL || 'owner@localhost').trim().toLowerCase()
const allowedEmails = new Set([
  ownerEmail,
  ...(process.env.ALLOWED_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
])
const providers: NextAuthConfig['providers'] = []
if (process.env.LOCAL_PASSWORD) {
  providers.push(
    Credentials({
      id: 'local',
      name: 'Local password',
      credentials: { password: { type: 'password' } },
      async authorize(credentials) {
        if (typeof credentials.password !== 'string' || !process.env.LOCAL_PASSWORD) return null
        const hash = (value: string) => createHash('sha256').update(value).digest()
        if (!timingSafeEqual(hash(credentials.password), hash(process.env.LOCAL_PASSWORD))) return null
        return db.user.upsert({
          where: { email: ownerEmail },
          update: { isAdmin: true },
          create: { email: ownerEmail, name: 'Journal owner', isAdmin: true },
        })
      },
    })
  )
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) providers.push(GitHub)
if (process.env.EMAIL_HOST && process.env.EMAIL_FROM)
  providers.push(
    Email({
      server: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        auth: { user: process.env.EMAIL_FROM, pass: process.env.EMAIL_PASSWORD },
      },
      from: process.env.EMAIL_FROM,
    })
  )

export const config = {
  trustHost: true,
  adapter: PrismaAdapter(db) as Adapter,
  providers,
  pages: { signIn: '/signin', verifyRequest: '/signin/verify-request' },
  basePath: '/api/auth',
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  events: {
    async createUser({ user }) {
      if (user.email?.toLowerCase() === ownerEmail)
        await db.user.update({ where: { id: user.id }, data: { isAdmin: true } })
    },
  },
  callbacks: {
    authorized() {
      return true
    },
    signIn({ user }) {
      return allowedEmails.has(user.email?.toLowerCase() || '')
    },
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig
export const { handlers, auth, signIn, signOut } = NextAuth(config)
