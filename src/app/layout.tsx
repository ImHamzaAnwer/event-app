import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

// Merriweather for headings

const merriweather = Merriweather({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Arts Councul",
  description: "Find the best events for arts and literature",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.variable} min-h-screen antialiased`}>
        <NavBar />
        {/* <div className="absolute inset-0 top-0 z-[-1] min-h-screen"></div> */}

        <main>{children}</main>
      </body>
    </html>
  );
}
