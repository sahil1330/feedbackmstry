import "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    isVerified?: boolean;
    username?: string;
    isAcceptingMessage?: boolean;
  }
  interface Session {
    user: {
      _id: string;
      isVerified?: boolean;
      username?: string;
      isAcceptingMessage?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    isVerified?: boolean;
    username?: string;
    isAcceptingMessage?: boolean;
  }
}
