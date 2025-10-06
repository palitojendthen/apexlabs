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
      <body className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
