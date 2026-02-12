import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WaitLyst — Join the Waitlist",
  description:
    "Be first in line. Join the waitlist for early access, exclusive perks, and rewards for spreading the word.",
  openGraph: {
    title: "WaitLyst — Join the Waitlist",
    description:
      "Be first in line. Join the waitlist for early access, exclusive perks, and rewards for spreading the word.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
