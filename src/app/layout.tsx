import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechVerse - Where Technology Meets Creativity",
  description:
    "Explore the latest in tech news, tutorials, opportunities, and resources. A modern blog covering technology, design, and career growth.",
  keywords: ["tech blog", "programming", "tutorials", "opportunities", "resources"],
  openGraph: {
    title: "TechVerse - Where Technology Meets Creativity",
    description:
      "Explore the latest in tech news, tutorials, opportunities, and resources.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
