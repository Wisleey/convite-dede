import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Convite de Aniversário - Dedé Sales 50 Anos",
  description: "Você está convidado para comemorar os 50 anos do Dedé Sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" style={{ backgroundColor: "#000000" }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.style.backgroundColor = '#000000';
              document.documentElement.classList.add('dark');
              if (typeof window !== 'undefined') {
                document.addEventListener('DOMContentLoaded', function() {
                  document.body.style.backgroundColor = '#000000';
                  document.body.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)';
                });
              }
            `,
          }}
        />
      </head>
      <body className="dark" style={{ backgroundColor: "#000000" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
