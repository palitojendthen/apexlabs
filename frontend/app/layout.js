import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "ApexQuantLabs",
  description: "Quantitative Research and Backtesting Platform",
};

// Make a small wrapper client component for ThemeProvider
function ThemeWrapper({ children }) {
  "use client";
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
