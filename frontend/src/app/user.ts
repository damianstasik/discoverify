import * as jose from "jose";

import { cookies } from "next/headers";

interface AuthTokenInterface extends jose.JWTPayload {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function getTokenFromCookie() {
  const cookieStore = cookies();
  try {
    const secret = new TextEncoder().encode("test");
    const { payload } = await jose.jwtVerify(
      cookieStore.get("token")?.value || "",
      secret,
    );

    return payload as AuthTokenInterface;
  } catch {
    return null;
  }
}
