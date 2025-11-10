import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CampusCash - Sistema de Moeda Estudantil",
  description:
    "Sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual",
  keywords: ["moeda virtual", "estudantil", "mérito", "universidade", "campus"],
  authors: [{ name: "CampusCash Team" }],
  openGraph: {
    title: "CampusCash - Sistema de Moeda Estudantil",
    description:
      "Sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} light`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
