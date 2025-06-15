import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AuthUser } from '@/lib/auth'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: session.user.role as string,
      })
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [status, session])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return false
    }
    return true
  }

  const requireAdmin = () => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push('/dashboard')
      return false
    }
    return true
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    requireAuth,
    requireAdmin,
  }
} 