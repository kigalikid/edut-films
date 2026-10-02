import type { Metadata } from "next";
import { Frank_Ruhl_Libre, IBM_Plex_Mono, Inter, Marcellus } from "next/font/google";
import "./globals.css";

// Marcellus: Latin headlines, drawn from Roman stone inscriptions.
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

// Frank Ruhl Libre: the Hebrew wordmark only.
const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Edut Films — photography & film in the Holy Land",
  description:
    "Edut Films travels with pilgrim groups in the Holy Land and sends them home with a film and photographs of the journey.",
  // Preview deploy: kept out of search engines until Michael has approved the content.
  // Delete this line when the site moves to its real domain.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${marcellus.variable} ${frank.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
