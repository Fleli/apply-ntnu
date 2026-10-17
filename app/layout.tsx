import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Apply NTNU – Søk på internships sammen",
    template: "%s | Apply NTNU",
  },
  description:
    "Apply NTNU er en studentorganisasjon ved NTNU som arrangerer søknadskvelder der studenter søker på internships og sommerjobber sammen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
