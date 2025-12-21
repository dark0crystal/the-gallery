import { auth } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { hasRole } from './roles'

export async function requireAuth() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth()
  const userRole = session.user.role as UserRole
  
  if (!hasRole(userRole, requiredRole)) {
    throw new Error('Forbidden: Insufficient permissions')
  }
  
  return session
}

export async function requireModerator() {
  return requireRole('MODERATOR')
}

export async function requireAdmin() {
  return requireRole('ADMIN')
}

