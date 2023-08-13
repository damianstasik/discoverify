import { redirect } from "next/navigation";
import { Player } from "../../components/Player";
import { Sidebar } from "../../components/Sidebar";
import { getTokenFromCookie } from "../user";
import { TokenProvider } from "./context";

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

  const body = await res.json();

  const { email, display_name: displayName, id, images } = body;

  return {
    email,
    displayName: displayName || null,
    spotifyId: id,
    photoUrl: images?.[0].url || null,
    token,
  };
}

export default async function Layout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    return <div to="/login" state={location} replace />;
  }

  return (
    <TokenProvider token={user.token.accessToken}>
      <div className="flex h-screen">
        <aside className="w-80">
          <Sidebar />
        </aside>

        <main className="bg-slate-900 flex flex-col flex-1">
          <div
            className="flex flex-col relative overflow-hidden"
            style={{
              height: "calc(100% - 100px)",
            }}
          >
            {children}
          </div>

          <div style={{ height: "100px" }} className="mt-auto">
            <Player />
          </div>
        </main>
      </div>
    </TokenProvider>
  );
}
