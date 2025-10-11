"use client";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { I18nextProvider } from "react-i18next";
import { i18nInstance } from "@/language/i18n";
import { Suspense } from "react";
import LocaleProvider from "@/components/locale-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>TSE Club – Learn to Code, Shape the Future</title>
      </head>
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          <LocaleProvider>
            {() => (
              <I18nextProvider i18n={i18nInstance}>
                <Header />
                {children}
                <Footer />
              </I18nextProvider>
            )}
          </LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
