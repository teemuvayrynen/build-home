import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith"},
        password: { label: "Passoword", type: "password" }
      },
      async authorize(credentials, req) {
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
          })
        })
        const user = await res.json()
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  }
})
