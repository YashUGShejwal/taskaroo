import { getServerSession } from 'next-auth'
import { User } from '@/types'
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import { User as MongoUser } from '@/models/user';

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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectToDatabase();

        const user = await MongoUser.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
};

// Legacy JWT code moved to src/lib/legacy/jwt.ts for reference 