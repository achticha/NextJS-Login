import { connectMongoDB } from "../../../../../lib/mongodb"; // เส้นทางที่ถูกต้อง
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import LineProvider from "next-auth/providers/line";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials) {
            const { name, password } = credentials;

            try {
                await connectMongoDB();
                const user = await User.findOne({ name });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return null;
                }

                console.log("userlogin: " ,user);
                return user;
            } catch(error) {
                console.log("Error: ", error)
            }
          }
        }),
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                return {
                    ...token,
                    id: user._id,
                    role: user.role
                }
            }
            return token
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role
                }
            }
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
