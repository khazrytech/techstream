import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TechStreamProvider } from "@/context/TechStreamContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStream - Live TV & Entertainment",
  description: "Tazama Live TV, Michezo, Movies na Tamthilia kwa kiwango cha juu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-red-600`}>
        <TechStreamProvider>
          {children}
        </TechStreamProvider>
      </body>
    </html>
  );
}
