import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Is My Cancun Beach Ruined?",
  description: "A fast AI checker for Cancun and Riviera Maya seaweed risk, alternatives, and trip backup plans."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
