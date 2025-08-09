import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, maxAgeSeconds = 60 * 60 * 24 * 7 } = await req.json();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
  return res;
}
