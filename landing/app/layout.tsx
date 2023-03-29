import './globals.css';

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="bg-slate-1000 text-white">
      <head />
      <body>{children}</body>
    </html>
  );
}
