import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — Search the world’s books`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "가입 없이 전 세계 원서를 검색하세요. Open Library로 책을 찾고, 주제별로 탐색하고, Amazon에서 바로 구매할 수 있는 가벼운 도서 검색 서비스입니다.",
  keywords: [
    "book search",
    "Open Library",
    "원서 검색",
    "global books",
    "ISBN",
    "fiction",
    "nonfiction",
  ],
  openGraph: {
    title: `${SITE_NAME} — Search the world’s books`,
    description:
      "Free global book search powered by Open Library. No account required.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}`,
    description: "Search world literature by title, author, ISBN, or subject.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        {adsenseClient ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
