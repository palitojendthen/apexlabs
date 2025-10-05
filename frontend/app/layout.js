"use client";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "ApexQuantLabs",
  description: "Quantitative Research and Backtesting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}