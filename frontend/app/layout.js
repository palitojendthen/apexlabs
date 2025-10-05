import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "ApexQuantLabs",
  description: "Quantitative Research and Backtesting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}