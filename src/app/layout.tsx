import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suivi Engagement Tuteurs",
  description: "Plateforme de suivi de l'engagement des tuteurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
