import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Inter, Orbitron, Quantico } from "next/font/google";

import "@/globals.css";

import { LOCALES } from "@repo/i18n/web";

import RootProvider from "@/providers/root-provider";
import { hasSessionTokensAction } from "@/actions/session.actions";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const quantico = Quantico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-quantico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitMaster",
  description: "FitMaster is a platform for following your progress in training programs.",
  icons: {
    icon: "assets/app-icon.png",
  },
};
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
  const { locale } = await params;
  const { hasRefreshToken } = await hasSessionTokensAction();
  const localeFontClass = locale === LOCALES.PL ? "font-inter" : "font-sans";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(localeFontClass, orbitron.variable, inter.variable, quantico.variable)}>
        <RootProvider session={hasRefreshToken} locale={locale}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
