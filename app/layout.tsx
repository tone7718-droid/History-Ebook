import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "역사 e-book",
    template: "%s | 역사 e-book",
  },
  description: "한국사·세계사 학습용 정적 콘텐츠 중심 e-book",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${noto.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <footer className="mt-16 border-t border-slate-200 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-center text-sm text-slate-500 dark:border-slate-800">
            교육용 원작 요약 · 교과서 원문 복제 금지 · MIT
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
