import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ServiceWorkerRegister } from "@/components/sw-register";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Himalayan Freak - Custom Himalayan Travel Experiences",
  description:
    "Himalayan Freak is a Kashmir-based travel agency crafting bespoke journeys across Jammu, Kashmir, Ladakh and the entire Himalayan range. AI travel agent, custom packages, real-time flights & trains, group bookings.",
  keywords: [
    "Himalayan Freak",
    "Kashmir travel",
    "Ladakh tours",
    "Gulmarg",
    "Srinagar",
    "Pahalgam",
    "Leh Ladakh",
    "Himalayan holidays",
    "custom trip planner",
    "Kashmir packages",
    "Drung",
    "Bangus Valley",
    "Gurez",
    "AI travel agent",
  ],
  authors: [{ name: "Himalayan Freak", url: "https://himalayanfreak.in" }],
  creator: "Syed Shamshul Razvi",
  publisher: "Himalayan Freak",
  applicationName: "Himalayan Freak",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.webp", sizes: "192x192", type: "image/webp" },
      { url: "/logo.webp", sizes: "512x512", type: "image/webp" },
    ],
    apple: [{ url: "/logo.webp", sizes: "180x180", type: "image/webp" }],
    shortcut: ["/logo.webp"],
  },
  appleWebApp: {
    capable: true,
    title: "Himalayan Freak",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Himalayan Freak - Custom Himalayan Travel Experiences",
    description:
      "Bespoke journeys across Jammu, Kashmir, Ladakh and the entire Himalayan range. Plan trips with AI travel agent, search real flights & trains, build custom itineraries.",
    siteName: "Himalayan Freak",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Himalayan Freak",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Freak",
    description: "Custom Himalayan travel experiences from Kashmir.",
    images: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // allow zoom for accessibility
  viewportFit: "cover",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA: iOS web app meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Himalayan Freak" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Safe area for notches */}
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body
        className={`${jakarta.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <ServiceWorkerRegister />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
