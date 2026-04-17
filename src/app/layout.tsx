import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechVerse - Where Technology Meets Creativity",
  description:
    "Explore the latest in tech news, tutorials, opportunities, and resources. A modern blog covering technology, design, and career growth.",
  keywords: ["tech blog", "programming", "tutorials", "opportunities", "resources"],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>',
  },
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
