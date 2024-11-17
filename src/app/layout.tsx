import type { Metadata } from "next";
import "./globals.css";
import Footer from '@/components/footer';
import NavBar from '@/components/navbar';
import { Providers } from './providers'
import {NextUIProvider} from "@nextui-org/react";

export const metadata: Metadata = {
  title: 'LocalCrave',
  description: 'Home cooked dishes straight from kitchen to home',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
        <head>
          <link rel="icon" href="/icons/favicon.svg" sizes="128x128" />
        </head>
        <body>  
          <Providers>
          <NavBar /> {children} <Footer />
          </Providers>
        </body>
      </html>
  );
}
