import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { SITE_CONFIG } from "@/lib/constants";
import ErrorBoundary from "@/components/ErrorBoundary";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sparkinnovations.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_CONFIG.name} — Authorized Kutchina Distributor in Kolkata | Kitchen Chimneys, Hobs & Appliances`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: "Spark Innovations is Kolkata's authorized Kutchina distributor. Shop kitchen chimneys, hobs, cooktops, water purifiers, dishwashers & built-in ovens with free installation, genuine warranty & best prices.",
  keywords: [
    "Kutchina", "Kutchina chimney", "kitchen chimney", "auto clean chimney",
    "hob", "cooktop", "gas hob", "built-in hob",
    "water purifier", "RO purifier", "Kutchina water purifier",
    "dishwasher", "built-in oven", "kitchen appliances",
    "Kutchina distributor Kolkata", "Kutchina dealer", "Kutchina authorized dealer",
    "kitchen appliances Kolkata", "chimney price", "hob price",
    "Spark Innovations", "buy chimney online", "best kitchen chimney India",
  ],
  authors: [{ name: "Spark Innovations", url: SITE_URL }],
  creator: "Spark Innovations",
  publisher: "Spark Innovations",
  formatDetection: { telephone: true, email: true, address: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — Authorized Kutchina Distributor`,
    description: "Shop genuine Kutchina kitchen chimneys, hobs, water purifiers & appliances at best prices. Free installation & official warranty. Serving Kolkata & all India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spark Innovations — Authorized Kutchina Kitchen Appliances Distributor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — Kutchina Kitchen Appliances`,
    description: "Shop genuine Kutchina chimneys, hobs, water purifiers & more. Authorized distributor with free installation & warranty.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
};



const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Spark Innovations",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  description: "Authorized Kutchina distributor in Kolkata. Premium kitchen chimneys, hobs, water purifiers & appliances.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["English", "Hindi", "Bengali"],
  },
  sameAs: [],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Spark Innovations",
  description: "Authorized Kutchina kitchen appliances distributor. Chimneys, hobs, cooktops, water purifiers, dishwashers.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
  },
  priceRange: "₹₹",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-inter">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <ErrorBoundary>
          <ToastProvider>
            <SettingsProvider>
              <AuthProvider>
                <GoogleAuthProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <SmoothScroll>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <WhatsAppFloat />
                      </SmoothScroll>
                    </WishlistProvider>
                  </CartProvider>
                </GoogleAuthProvider>
              </AuthProvider>
            </SettingsProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}



