import BackgroundFX from "./components/BackgroundFX";
import Navbar from "./components/Navbar";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ApexQuantLabs",
  description: "Quantitative Research & Backtesting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* base background only */}
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Providers>
          <BackgroundFX />
          <Navbar />
          <main className="pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
