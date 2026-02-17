import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/" },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const url = `${process.env.BASE_URL || process.env.NEXTAUTH_URL}/api/login/`;

          const response = await axios.post(url, {
            username: credentials.username,
            password: credentials.password,
          });

          const data = response.data;

          if (!data || !data.access) return null;

          // Decode JWT manually (base64)
          const payloadBase64 = data.access.split(".")[1];
          const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());

          // payload should contain user_id (Django SimpleJWT)
          return {
            id: payload.user_id,
            username: credentials.username,
            authToken: data.access,
            refreshToken: data.refresh,
          };
        } catch (err) {
          console.error("authorize error:", err?.response?.data || err.message);
          throw new Error(err?.response?.data?.detail || "AUTH_FAILED");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.authToken = user.authToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        username: token.username,
        authToken: token.authToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
