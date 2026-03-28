import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import { LanguageProvider } from "@/context/LanguageContext";
import PromoPopup from "@/components/ui/PromoPopup";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "HyperV Store",
  description: "La Mejor Desarrolladora de Software",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "HyperV Store",
    description: "La Mejor Desarrolladora de Software",
    url: "https://hyperv.online",
    siteName: "HyperV Store",
    images: [
      {
        url: "/portada.png",
        width: 1200,
        height: 630,
        alt: "HyperV Store",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperV Store",
    description: "La Mejor Desarrolladora de Software",
    images: ["/portada.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={outfit.className}>
        <LanguageProvider>
          <ReduxProvider>
            {children}
            <PromoPopup />
          </ReduxProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
