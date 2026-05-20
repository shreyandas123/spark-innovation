"use client";

import Script from "next/script";
import { useSettings } from "@/contexts/SettingsContext";

export default function GoogleAnalytics() {
  const { settings } = useSettings();
  
  // Try to get GA ID from settings first, then fall back to env var
  const gaId = settings?.analytics?.gaMeasurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || gaId === "G-XXXXXXXXXX") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}





