"use client";
import BackgroundFX from "@/app/components/BackgroundFX";
import ThemeToggle from "@/app/components/ThemeToggle";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      router.replace("/");
    } catch (e) {
      setErr("Invalid email or password");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0e0f] to-[#1a1a1d] text-gray-200">
      <BackgroundFX />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900/70 border border-neutral-700 shadow-xl backdrop-blur-sm">
        <h1 className="text-center text-2xl font-semibold mb-6">
          Sign in to ApexLabs
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 ml-3 px-2 py-1 rounded bg-[#1e1e20] border border-gray-700 focus:outline-none focus:border-red-600"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="flex-1 ml-3 px-2 py-1 rounded bg-[#1e1e20] border border-gray-700 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {err && <p className="text-red-400 text-sm text-center">{err}</p>}

          <button
            type="submit"
            className="mt-3 w-full py-2 rounded font-semibold text-white bg-gradient-to-r from-red-700 to-red-900 hover:opacity-90"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/pricing" className="text-red-500 hover:underline">
            Subscribe & Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
