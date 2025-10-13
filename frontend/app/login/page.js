"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackgroundFX from "../components/BackgroundFX";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // fix: ensure dark theme persists when navigating from dark pages
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // mock login – replace with Firebase/FastAPI auth later
    setTimeout(() => {
      setLoading(false);
      router.push("/"); // redirect to Research & Backtest after login
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX />

      <div className="w-full max-w-lg p-11 rounded-2xl bg-white/5 dark:bg-white/5 border dark:border-white/10 backdrop-blur-md shadow-xl">
        <h1 className="text-[2rem] font-semibold text-center mb-2">
          Welcome Back!
        </h1>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 
                       text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-teal-400 hover:underline">
            Sign up
          </a>
        </p>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-white/10" />
          <span className="text-neutral-400 text-xs">OR</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        {/* Social login buttons with transparent icons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-4 border border-neutral-700 py-4 rounded hover:bg-neutral-800 transition text-sm">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
          <button className="flex items-center justify-center gap-4 border border-neutral-700 py-4 rounded hover:bg-neutral-800 transition text-sm">
            <img
              src="https://www.svgrepo.com/show/452062/microsoft.svg"
              alt="Microsoft"
              className="w-5 h-5"
            />
            Continue with Microsoft
          </button>
          <button className="flex items-center justify-center gap-4 border border-neutral-700 py-4 rounded hover:bg-neutral-800 transition text-sm">
            <img
              src="https://www.svgrepo.com/show/132586/apple.svg"
              alt="Apple"
              className="w-7 h-7"
            />
            Continue with Apple
          </button>
        </div>
      </div>

      {/* footer */}
      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
