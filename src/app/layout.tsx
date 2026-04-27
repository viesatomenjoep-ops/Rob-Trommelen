import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Equivest | Invest in Premium Sport Properties & Jumpers in Belgium",
  description: "Equivest is the premier platform to invest in elite sport properties, hunters, jumpers, and equitation properties in Belgium. Discover top-tier equestrian investments.",
  keywords: "sport properties Belgium, invest in sport properties, sport properties, jumpers, hunters, equitation property, elite showjumpers, equestrian investments",
  openGraph: {
    title: "Equivest | Premium Sport Properties & Equestrian Investments",
    description: "Invest in elite sport properties, hunters, and jumpers in Belgium.",
    url: "https://www.equivestworldwide.com",
    siteName: "Equivest Worldwide",
    type: "website",
  },
  robots: "index, follow",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} antialiased font-sans bg-background text-foreground min-h-screen flex flex-col`}
      >
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        {children}
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'en,nl,de,es', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  );
}
