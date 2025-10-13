"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BackgroundFX from "../components/BackgroundFX";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // fix: ensure dark theme persists when navigating
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // mock sign up – replace with Firebase/FastAPI signup + BigQuery insert
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-16 bg-white text-black dark:bg-gradient-to-b dark:from-black dark:to-slate-950 dark:text-white transition-colors duration-300 opacity-80">
      <BackgroundFX />

      <div className="w-full max-w-lg p-11 rounded-2xl bg-white/5 dark:bg-white/5 border dark:border-white/10 backdrop-blur-md shadow-xl">
        <h1 className="text-[2rem] font-semibold text-center mb-2">
          Create an Account!
        </h1>
        <p className="text-neutral-400 text-center mb-6 text-sm">
          Subscribe to use full features
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            required
          />

          {/* password */}
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            required
          />

          {/* fullname */}
          <input
            type="text"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          />

          {/* Plan dropdown */}
          <select
            name="plan"
            defaultValue="Essentials"
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            <option value="Essentials">Essentials</option>
            <option value="Plus" disabled>
              Plus 🔒 (coming soon)
            </option>
          </select>

          {/* Background dropdown */}
          <select
            name="background"
            defaultValue=""
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            <option value="">Select your background</option>
            <option>New to trading</option>
            <option>Actively manual trade</option>
            <option>A data scientist looking to automate trade</option>
            <option>Algorithmic trading experience</option>
            <option>Quantitative researcher / developer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 
                       text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        <p className="text-center text-neutral-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-teal-400 hover:underline">
            Log in
          </a>
        </p>
      </div>

      {/* footer */}
      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}
