import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechStream Pro",
  description: "Next-gen IPTV streaming platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
