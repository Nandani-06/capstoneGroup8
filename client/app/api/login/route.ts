import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  const res = await fetch("http://backend:8000/token-auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  });

  const contentType = res.headers.get("content-type") || "";

  if (res.ok) {
    // Extract the token from the response
    const { token } = await res.json();

    // Set a cookie to store the token
    const cookieStore = cookies();
    (await cookieStore).set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect to the homepage
    return NextResponse.redirect(new URL("/", req.url));
  }
}
