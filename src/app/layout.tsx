import "./globals.css";

import { Providers } from "./providers";
import { SpotifyScript } from "./spotify";

export const metadata = {
  title: "Discoverify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="bg-slate-1000 text-white">
        <SpotifyScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
