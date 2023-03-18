import './globals.css';

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="bg-gray-900 text-white">
      <head />
      <body>{children}</body>
    </html>
  );
}
