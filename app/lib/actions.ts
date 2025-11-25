"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { defaultSession, SessionData, sessionOptions } from "./sessioner";
import { redirect } from "next/navigation";
import dbConnect from "./db";
import { User } from "@/models/User";

export const getSession = async () => {
  const cookieStore = await cookies();

  const cookieHandler = {
    get: (name: string) => {
      const cookie = cookieStore.get(name);
      if (!cookie) return undefined;
      return { name: cookie.name, value: cookie.value };
    },
    set: (name: string, value: string) => cookieStore.set(name, value),
    remove: (name: string) => cookieStore.delete(name),
  };

  const session = await getIronSession<SessionData>(
    cookieHandler,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};


export const HandleCreateUser = async () => {
  try {
    await dbConnect()

    const newUser = new User({
      username: "testuser",
    })

    await newUser.save()

  } catch (error) {
    console.log("Error creating user:", error);
  }
}