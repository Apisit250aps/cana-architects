import NextAuth from 'next-auth'
import { User } from './models/users'
import Credentials from 'next-auth/providers/credentials'
import argon2 from 'argon2'
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        name: {
          label: 'name',
          type: 'email',
          placeholder: 'user@example.com'
        },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const { name, password } = credentials as {
          name: string
          password: string
        }
        const user = await User.findOne({ name })
        console.log(user)
        if (!user) {
          return null
        }
        const isValid = await argon2.verify(user.password, password);
        if (!isValid) {
          return null
        }

        return { id: user._id, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: 'jwt'
  }
})
