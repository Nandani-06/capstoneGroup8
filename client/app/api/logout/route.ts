import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  (await cookieStore).set("token", "", { path: "/", maxAge: 0 }); // Clear the token
  return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}