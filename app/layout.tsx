import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Cairo, Tajawal } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
