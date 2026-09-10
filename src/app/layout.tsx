import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStream - Streaming App",
  description: "Tazama movie na series kwa urahisi",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-red-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
