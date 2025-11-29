import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";

// Merriweather for headings
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevEvents",
  description: "Find the best events for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.className} min-h-screen antialiased`}>
        {/* <NavBar /> */}
        {/* <div className="absolute inset-0 top-0 z-[-1] min-h-screen"></div> */}

        <main>{children}</main>
      </body>
    </html>
  );
}
