import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Die Table Designer — Design Your Beer Die Table",
  description: "Design your perfect beer die table — drag & drop logos, brands, and graphics onto a virtual tabletop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
