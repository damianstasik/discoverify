import { RedirectType, redirect } from "next/navigation";
import { Player } from "../../components/Player";
import { Sidebar } from "../../components/Sidebar";
import { getTokenFromCookie } from "../user";
import { TokenProvider } from "./context";
import { ReactNode } from "react";

async function getCurrentUser() {
  const token = await getTokenFromCookie();
  if (!token) {
    redirect("/login");
  }

  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const body = (await res.json()) as SpotifyApi.CurrentUsersProfileResponse;

  const { email, display_name: displayName, id, images } = body;

  return {
    email,
    displayName: displayName || null,
    spotifyId: id,
    photoUrl: images?.[0].url || null,
    token,
  };
}

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login", RedirectType.replace);
  }

  return (
    <TokenProvider token={user.token.accessToken}>
      <div className="flex h-screen">
        <aside className="w-80">
          <Sidebar />
        </aside>

        <main className="bg-slate-900 flex flex-col flex-1">
          <div className="flex flex-col relative overflow-hidden h-[calc(100%-theme(spacing.28))]">
            {children}
          </div>

          <div className="mt-auto h-28">
            <Player />
          </div>
        </main>
      </div>
    </TokenProvider>
  );
}
