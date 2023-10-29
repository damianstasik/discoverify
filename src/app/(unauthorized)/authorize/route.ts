import { redirect } from "next/navigation";
import { getSpotifyApi } from "../../sp";
import { to } from "../../to";

import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

async function authorize(code: string) {
  const spotifyApi = getSpotifyApi();

  const [codeGrantError, codeGrantResult] = await to(
    spotifyApi.authorizationCodeGrant(code),
  );

  if (codeGrantError || !codeGrantResult) {
    redirect("/login");
  }

  spotifyApi.setAccessToken(codeGrantResult.body.access_token);
  spotifyApi.setRefreshToken(codeGrantResult.body.refresh_token);

  const [profileError, profileResult] = await to(spotifyApi.getMe());

  if (profileError || !profileResult) {
    redirect("/login");
  }

  const secret = new TextEncoder().encode("test");
  const alg = "HS256";

  const jwt = await new jose.SignJWT({
    accessToken: codeGrantResult.body.access_token,
    refreshToken: codeGrantResult.body.refresh_token,
    userId: profileResult.body.id,
  })
    .setProtectedHeader({ alg })
    .setExpirationTime("1h") //codeGrantResult.body.expires_in
    .sign(secret);

  return jwt;

  // ctx.res.setCookie('token', token, {
  //   path: '/',
  //   httpOnly: true,
  //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'lax',
  // });
}

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/dashboard", request.url));
  try {
    const token = await authorize(request.nextUrl.searchParams.get("code")!);

    res.cookies.set("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (e) {
    redirect("/login");
  }
}
