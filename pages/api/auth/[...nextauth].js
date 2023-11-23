import clientPromise from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { mongooseConnect } from "@/lib/mongoose";

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "Enter your email",
          value: "test@mail.com",
        },
        password: {
          label: "Password:",
          type: "password",
          value: "test@mail.com",
        },
      },
      authorize: async (credentials) => {
        if (credentials.email === "test@mail.com" && credentials.password === "test@mail.com") {
          return {
            _id: "testID",
            name: "test admin",
            email: "test@mail.com",
            image: "https://placehold.co/100x100/orange/white/?text=t",
          };
        }
        return null;
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    maxAge: 24 * 60 * 60 * 30,
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ token, session, user }) {
      if (token?.user) {
        session.user = token.user;
        return session;
      }
      if (!session) {
        return false;
      }
    },
    async signIn({ account, user }) {
      if (account.provider === "google") {
        await mongooseConnect();
        const admin = await Admin.find({ email: user.email }).select("email -_id");
        if (admin.length > 0) {
          if (admin[0].email === user.email) {
            return true;
          }
        }
        throw new Error("Invalid email");
      }
      if (account.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
};

export async function isAdminRequest(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  const admin = await Admin.find({ email }).select("email -_id");
  if (admin.length > 0) {
    if (admin[0].email === email) {
      return;
    }
  }
  throw "Not Admin";
}

export default NextAuth(authOptions);
