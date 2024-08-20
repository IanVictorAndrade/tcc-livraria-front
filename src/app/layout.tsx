import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import {Toaster} from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livraria",
  description: "Protótipo de e-commerce de livros",
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/apple-touch-icon.png',
    }
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="pt-br">
      <body className={inter.className}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster position="top-right" richColors={true} pauseWhenPageIsHidden={true}/>
      </body>
      </html>
  );
}
