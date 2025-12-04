"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, SessionData, sessionOptions } from "./sessioner";
import { redirect } from "next/navigation";
import dbConnect from "./db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const getSession = async () => {
  const cookieStore = await cookies();

  const cookieHandler = {
    get: (name: string) => {
      const cookie = cookieStore.get(name);
      if (!cookie) return undefined;
      return { name: cookie.name, value: cookie.value };
    },

    set: (name: string, value: string, options?: any) => {
      cookieStore.set({
        name,
        value,
        ...options,
      });
    },

    remove: (name: string) => {
      cookieStore.delete(name);
    },
  };

  return await getIronSession(cookieHandler as any, sessionOptions);
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};


export const HandleCredentialSignin = async (payload: any) => {
  const usersession = await getSession() as any;

  const { email, password, firstTime } = payload;

  try {
    await dbConnect();

    let user = await User.findOne({ email }).lean();

    // REGISTER
    if (!user && firstTime) {
      const hash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hash,
      });

      // 🔥 Set session
      usersession.isLoggedIn = true;
      usersession.userId = newUser._id.toString();
      usersession.role = newUser.role;

      await usersession.save();

      revalidatePath("/");
      return { status: "success", message: "User created successfully" };
    }

    // LOGIN
    if (!user) {
      return { status: "error", message: "User not found" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return { status: "error", message: "Invalid credentials" };
    }

    // 🔥 Set session for existing user
    usersession.isLoggedIn = true;
    usersession.userId = user._id.toString();
    usersession.role = user.role;

    await usersession.save();

    revalidatePath("/");
    return { status: "success", message: "Logged in successfully" };
  } catch (error) {
    console.log("Error during credential signin:", error);
    return { status: "error", message: "Internal server error" };
  }
};


export const HandleWalletSignin = async (payload:any) => {
  const metaAddress = payload.metaAddress;
  const firstTime = payload.firstTime;
  const signature = payload.signature;
  const usersession = await getSession() as any;
  try {
    await dbConnect();

    const currentUser = await User.find({ sig: signature }).lean();

    if (currentUser.length === 0 && firstTime) {
      const newUser = new User({
        metaAddress,
        sig: signature,
      });

      usersession.isLoggedIn = true;
      usersession.userId = newUser._id.toString();
      usersession.role = newUser.role;
      usersession.metaAddress = metaAddress;

      await newUser.save();
      await usersession.save();

      revalidatePath("/");
      return { status: "success", message: "User created successfully" };
    }

    const ValidSig = currentUser[0].sig === signature;

    if (!ValidSig) {
      return { status: "error", message: "Invalid wallet" };
    }

    usersession.isLoggedIn = true;
    usersession.userId = currentUser[0]._id.toString();
    usersession.role = currentUser[0].role;
    usersession.metaAddress = metaAddress;
    await usersession.save();
    revalidatePath("/");
    return { status: "success", message: "User logged in successfully" };
  } catch (error) {
    console.log("Error during wallet signin:", error);
    return { status: "failed", message: "Internal server error" };
  }
};
