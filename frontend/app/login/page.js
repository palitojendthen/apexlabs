"use client";
import BackgroundFX from "@/app/components/BackgroundFX";
import ThemeToggle from "@/app/components/ThemeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !pw) {
      setErr("Please fill in all fields");
      return;
    }
    setErr("");
    // TODO: connect real Firebase login
    router.replace("/");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0e0f] to-[#1a1a1d] text-gray-200">
      {/* shared background */}
      <BackgroundFX />

      {/* theme toggle in corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* login container */}
      <div className="w-full max-w-md px-8 py-10 rounded-2xl bg-neutral-900/70 border border-neutral-700 shadow-xl backdrop-blur-md flex flex-col items-center">
        {/* centered logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/dummy_logo.png"
            alt="ApexQuantLabs"
            width={56}
            height={56}
            className="object-contain mb-2"
          />
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            ApexQuantLabs
          </h1>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#1a1a1d] border border-neutral-700 focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#1a1a1d] border border-neutral-700 focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          {err && <p className="text-red-400 text-sm text-center">{err}</p>}

          <button
            type="submit"
            className="mt-2 w-full py-2.5 rounded-md font-semibold text-black bg-gradient-to-r from-teal-400 to-cyan-500 hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        {/* alt options */}
        <div className="text-center text-sm text-gray-400 mt-6">or</div>

        {/* social buttons (placeholders for now) */}
        <div className="w-full mt-3 flex flex-col gap-2">
          <button className="w-full py-2 border border-neutral-700 rounded-md hover:bg-[#1e1e20] transition">
            Continue with Google
          </button>
          <button className="w-full py-2 border border-neutral-700 rounded-md hover:bg-[#1e1e20] transition">
            Continue with Microsoft
          </button>
          <button className="w-full py-2 border border-neutral-700 rounded-md hover:bg-[#1e1e20] transition">
            Continue with Apple
          </button>
        </div>

        {/* footer text */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Don’t have an account?{" "}
          <a href="/pricing" className="text-teal-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
