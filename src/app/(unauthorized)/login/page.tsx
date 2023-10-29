import { redirect } from "next/navigation";
import { getSpotifyApi } from "../../sp";
import { LoginButton } from "./LoginButton";

async function getUrl() {
  "use server";

  const url = getSpotifyApi().createAuthorizeURL(scopes, "");

  redirect(url);
}

const scopes = [
  "user-read-private",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-read-currently-playing",
  "user-follow-read",
  "playlist-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-read-collaborative",
  "user-follow-modify",
  "user-library-modify",
  "streaming",
];

export default function Login() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form action={getUrl} className="w-96 p-4 bg-slate-700 rounded-lg">
        <h2 className="font-bold text-lg/none text-white">Login</h2>
        <p className="my-3 text-slate-300 text-sm">
          You can login with Spotify by clicking the button below.
        </p>
        <LoginButton />
      </form>
    </div>
  );
}
