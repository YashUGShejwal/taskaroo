import { getServerSession } from 'next-auth'
import { User } from '@/types'

export class AuthService {
  static async getCurrentUser() {
    const session = await getServerSession()
    return session?.user
  }

  static async isAdmin() {
    const user = await this.getCurrentUser()
    return user?.role === 'admin'
  }

  static async requireAdmin() {
    const isAdmin = await this.isAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized')
    }
  }
}

// Legacy JWT code moved to src/lib/legacy/jwt.ts for reference 