import * as jose from "jose";

import { cookies } from "next/headers";

interface AuthTokenInterface {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function getTokenFromCookie() {
  const cookieStore = cookies();
  try {
    const secret = new TextEncoder().encode("test");
    const { payload } = await jose.jwtVerify<AuthTokenInterface>(
      cookieStore.get("token")?.value || "",
      secret,
    );

    return payload;
  } catch {
    return null;
  }
}
