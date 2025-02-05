import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { type Adapter } from 'next-auth/adapters'
import { db } from '@/db/db'

import GitHub from 'next-auth/providers/github'
import Email from 'next-auth/providers/nodemailer'
// 其他 provider 看 https://github.com/nextauthjs/next-auth/blob/main/apps/examples/nextjs/auth.ts

import type { NextAuthConfig } from 'next-auth'

export const config = {
  trustHost: true,
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GitHub,
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  basePath: '/auth',
  callbacks: {
    authorized({ request, auth }) {
      // const { pathname } = request.nextUrl
      // if (pathname.startsWith('/work/')) return !!auth // 因为 NextAuth Adapter 默認不支持 middleware，所以這裡暫時不用
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
