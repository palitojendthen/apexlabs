"use client";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      value={{ dark: "dark", light: "light" }}
    >
      {children}
    </ThemeProvider>
  );
}
