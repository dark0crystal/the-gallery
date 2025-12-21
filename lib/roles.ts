import { UserRole } from '@prisma/client'

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function isModerator(role: UserRole): boolean {
  return hasRole(role, 'MODERATOR')
}

export function isAdmin(role: UserRole): boolean {
  return hasRole(role, 'ADMIN')
}

export function canModerate(role: UserRole): boolean {
  return isModerator(role) || isAdmin(role)
}

export function canManageUsers(role: UserRole): boolean {
  return isAdmin(role)
}

