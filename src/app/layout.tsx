import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "TechStream - Stream Everything. Experience More.",
  description: "Premium entertainment platform for Movies, TV Series, Sports and Live Streaming. Your ultimate streaming destination.",
  keywords: ["TechStream", "streaming", "movies", "TV series", "sports", "live streaming", "entertainment"],
  authors: [{ name: "TechStream" }],
  icons: {
    icon: "/techstream-logo.png",
    apple: "/techstream-logo.png",
  },
  openGraph: {
    title: "TechStream - Stream Everything. Experience More.",
    description: "Premium entertainment platform for Movies, TV Series, Sports and Live Streaming.",
    type: "website",
    images: ["/techstream-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechStream - Stream Everything. Experience More.",
    description: "Premium entertainment platform for Movies, TV Series, Sports and Live Streaming.",
    images: ["/techstream-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
