// "use client";

// import { ThemeProvider } from "next-themes";
// import { usePathname } from "next/navigation";
// import Navbar from "./components/Navbar";
// import "./globals.css";

// export default function RootLayout({ children }) {
//   const pathname = usePathname();

//   const hideNavbar =
//     pathname.startsWith("/login") || pathname.startsWith("/signup");

//   return (
//     <html lang="en">
//       <body className="transition-colors duration-300">
//         <ThemeProvider attribute="class" defaultTheme="dark">
//           {!hideNavbar && <Navbar />}
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }


"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../lib/AuthContext"; // ✅ add this line
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <html lang="en">
      <body className="transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AuthProvider> {/* ✅ wrap everything inside AuthProvider */}
            {!hideNavbar && <Navbar />}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}