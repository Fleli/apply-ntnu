import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { headers } from "next/headers";
import { getAccount } from "@/lib/account";

export const metadata: Metadata = {
  title: {
    default: "Apply NTNU – Søk på internships sammen",
    template: "%s | Apply NTNU",
  },
  description:
    "Apply NTNU er en studentorganisasjon ved NTNU som arrangerer søknadskvelder der studenter søker på internships og sommerjobber sammen.",
};

// Innholdet kommer fra databasen, så sidene rendres ved hver forespørsel.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Public pages still render their content if the account service is unavailable.
  // Protected pages perform their own session checks and fail closed.
  const account = await getAccount(new Headers(await headers())).catch(() => null);
  return (
    <html lang="nb" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <Navbar account={account ? { name: account.name, image: account.image } : null} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
