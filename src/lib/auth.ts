import CredentialsProvider from 'next-auth/providers/credentials';
import { userService } from '@/lib/db/$users';
import type { JWT } from 'next-auth/jwt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await userService.verifyCredentials(credentials.email, credentials.password);

          if (user) {
            await userService.updateLastLogin(user.id);

            return {
              id: user.id.toString(),
              name: user.email.split('@')[0],
              email: user.email,
              role: user.role,
            };
          }

          return null;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT & { role?: string }; user?: { role?: string } }) {
      if (user) {
        if ('role' in user) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: { user?: { id?: string; role?: string; email?: string } };
      token: JWT & { role?: string; sub?: string };
    }) {
      if (token && token.sub) {
        if (session.user) {
          session.user.id = token.sub || '';
        }
        if (session.user && 'role' in session.user && 'role' in token) {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
