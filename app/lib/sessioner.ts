import { SessionOptions } from "iron-session";
import { Types } from "mongoose";

export interface SessionData {
    email?: string;
    isPro?: boolean;
    isLoggedIn?: boolean;
    role?: string;
    metaAddress?: string;
    userId?: string | Types.ObjectId;
    metaLogin?: boolean;
}

export const defaultSession:SessionData =  {
    isLoggedIn: false
}

export const sessionOptions: SessionOptions = {
    password: process.env.AUTH_SECRET!,
    cookieName: "lyub24-blog",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV  === "production"
    }
} 