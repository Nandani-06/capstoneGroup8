import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Parse the JSON data from the request
  const { username, password } = await req.json();

  // Call the Django backend's /token-auth/ API
  const res = await fetch("http://127.0.0.1:8000/token-auth/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username, password }),
  });

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

  // If login fails, return the error response
  const error = await res.json();
  return new NextResponse(JSON.stringify({ error: error.detail || "Invalid username or password" }), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}