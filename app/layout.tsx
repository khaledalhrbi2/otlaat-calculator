import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "عطلات | حاسبة السفر الذكية",
    template: "%s | عطلات",
  },
  description:
    "احسب تكلفة رحلتك القادمة بدقة - فنادق، جولات، تنقلات، ومصاريف يومية. واكتشف باقات عطلات السياحية الجاهزة بالريال السعودي.",
  keywords: [
    "حاسبة سفر",
    "باقات سياحية",
    "حجز فنادق",
    "عطلات",
    "سفر السعودية",
    "شهر العسل",
    "رحلات عائلية",
  ],
  authors: [{ name: "عطلات", url: "https://otlaat.sa" }],
  metadataBase: new URL("https://otlaat.sa"),
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: "عطلات",
    title: "عطلات | حاسبة السفر الذكية",
    description:
      "احسب تكلفة رحلتك القادمة بدقة واكتشف باقات سياحية مناسبة لميزانيتك.",
  },
  twitter: {
    card: "summary_large_image",
    title: "عطلات | حاسبة السفر الذكية",
    description:
      "احسب تكلفة رحلتك القادمة بدقة واكتشف باقات سياحية مناسبة لميزانيتك.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
