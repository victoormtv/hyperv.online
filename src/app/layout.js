import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import { LanguageProvider } from "@/context/LanguageContext";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "HyperV Store",
  description: "La Mejor Desarrolladora de Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={outfit.className}>
        <LanguageProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
