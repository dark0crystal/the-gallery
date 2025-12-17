import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import { prisma } from './prisma'
import { routing } from '@/i18n/routing'

// Generate a secret if not provided (for development only)
const getSecret = () => {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  if (secret) return secret
  
  // In production, this should always be set
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set in production')
  }
  
  // For development, generate a temporary secret
  // This is not secure and should only be used in development
  console.warn('⚠️  AUTH_SECRET not set. Using a temporary secret for development. Please set AUTH_SECRET in your .env file.')
  return 'development-secret-change-in-production'
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  secret: getSecret(),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, role: true, username: true },
        })
        
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.username = dbUser.username
        }
      }
      return session
    },
    async signIn() {
      // PrismaAdapter will handle account creation and linking
      // allowDangerousEmailAccountLinking allows linking accounts with same email
      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle undefined or invalid URLs
      if (!url || url === 'undefined' || url.includes('undefined')) {
        return `${baseUrl}/${routing.defaultLocale}`
      }
      
      // Handle redirect URLs properly with locale support
      // If URL is relative, ensure it includes the locale
      if (url.startsWith('/')) {
        // Clean up any undefined strings in the URL
        const cleanUrl = url.replace(/undefined/g, '')
        
        // Extract locale from URL if present
        const urlParts = cleanUrl.split('/').filter(Boolean)
        const firstPart = urlParts[0]
        
        // If first part is a valid locale, return as is
        if (firstPart && routing.locales.includes(firstPart as (typeof routing.locales)[number])) {
          return `${baseUrl}${cleanUrl}`
        }
        
        // Otherwise, prepend default locale
        return `${baseUrl}/${routing.defaultLocale}${cleanUrl}`
      }
      
      // If URL is absolute and same origin, clean it and return
      if (url.startsWith(baseUrl)) {
        const cleanUrl = url.replace(/undefined/g, '')
        // Ensure it still starts with baseUrl after cleaning
        if (cleanUrl.startsWith(baseUrl)) {
          return cleanUrl
        }
        return `${baseUrl}/${routing.defaultLocale}`
      }
      
      // Otherwise, redirect to default locale home
      return `${baseUrl}/${routing.defaultLocale}`
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'database',
  },
})

export const authOptions = {
  // For backward compatibility if needed
}
