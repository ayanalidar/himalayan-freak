import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

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
    "Himalayan Freak is a Kashmir-based travel agency crafting bespoke journeys across Jammu, Kashmir, Ladakh and the entire Himalayan range. Custom packages, expert guides, and unforgettable adventures.",
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
  ],
  authors: [{ name: "Himalayan Freak" }],
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Himalayan Freak - Custom Himalayan Travel Experiences",
    description:
      "Bespoke journeys across Jammu, Kashmir, Ladakh and the entire Himalayan range.",
    siteName: "Himalayan Freak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Freak",
    description: "Custom Himalayan travel experiences from Kashmir.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
