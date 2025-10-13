// import BackgroundFX from "./components/BackgroundFX";
// import Navbar from "./components/Navbar";
// import "./globals.css";
// import Providers from "./providers";

// export const metadata = {
//   title: "ApexQuantLabs",
//   description: "Quantitative Research & Backtesting Platform",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       {/* base background only */}
//       <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
//         <Providers>
//           <BackgroundFX />
//           <Navbar />
//           <main className="pt-20">{children}</main>
//         </Providers>
//       </body>
//     </html>
//   );
// }


"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Normalize and check all cases (handles trailing slashes and nested routes)
  const hideNavbar =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <html lang="en">
      <body className="transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {!hideNavbar && <Navbar />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
