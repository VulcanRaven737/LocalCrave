import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'LocalCrave',
  description: 'Home cooked dishes straight from kitchen to home',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="icons/favicon.svg" sizes="128x128" />
      <body>{children}</body>
    </html>
  )
}
