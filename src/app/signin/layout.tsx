import "../globals.css";

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
