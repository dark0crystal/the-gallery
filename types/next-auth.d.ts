import { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
      username?: string | null
    }
  }

  interface User {
    role: UserRole
    username?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    username?: string | null
  }
}

