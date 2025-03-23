import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect, { client } from "@/lib/dbConnect";
import User from "@/models/User";
import { compare } from "bcrypt";
import formSchema from "@/lib/schemas/signin";
const handler = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = formSchema.parse({ email: credentials?.email, password: credentials?.password });
          await dbConnect();
          const user = await User.findOne({ email });
          if (user && password) {
            if (await compare(password, user.get("password"))) {
              return user;
            }
          }
          return null;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // error: "/login",
  },
});

export { handler as GET, handler as POST };
