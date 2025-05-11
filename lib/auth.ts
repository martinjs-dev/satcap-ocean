import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // Retirer l'adapter ou utiliser correctement PrismaAdapter avec stratégie database
  // adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || "secret-de-fallback-a-changer-en-production",
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      
      // Vérifier à chaque renouvellement de token que l'utilisateur existe toujours
      if (token.email) {
        const dbUser = await db.user.findUnique({
          where: {
            email: token.email,
          },
          select: {
            id: true,
            name: true,
            email: true,
          }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
        }
      }
      
      return token;
    },
  },
};
