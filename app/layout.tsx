import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  title: "Convite de Aniversário - Dedé Sales 50 Anos",
  description: "Você está convidado para comemorar os 50 anos do Dedé Sales",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Convite Dedé Sales",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-title" content="Convite Dedé Sales" />
        <meta name="application-name" content="Convite Dedé Sales" />
      </head>
      <body className="dark bg-black text-yellow-400">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
