import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { User } from '@/types'

export class AuthService {
  static async getCurrentUser(): Promise<User | null> {
    const session = await getServerSession(authOptions)
    return session?.user as User || null
  }

  static async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === 'admin'
  }

  static async requireAdmin() {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required')
    }
  }
}

// Legacy JWT code moved to src/lib/legacy/jwt.ts for reference 