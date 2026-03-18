import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutreachOS",
  description: "B2B Cold Outreach Optimizer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
