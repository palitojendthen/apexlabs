"use client";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BackgroundFX from "../components/BackgroundFX";

import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();

  // billing cycle from pricing page
  const billingCycle = searchParams.get("billing") || "monthly";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, [setTheme]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await fetch("/api/bigquery-add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email,
          full_name: fullname,
          plan_type: "Essentials",
          billing_cycle: billingCycle,
        }),
      });

      // const res = await fetch("/api/payment", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ planType: "Essentials", billingCycle, email }),
      // });

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          planType: "Essentials_Beta",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await fetch("/api/bigquery-add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          full_name: user.displayName || "",
          plan_type: "Free",
          billing_cycle: null,
        }),
      });

      router.push("/");
    } catch (err) {
      console.error("Google signup failed:", err);
      alert("Google signup failed.");
    } finally {
      setLoading(false);
    }
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
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
            required
          />

          <input
            type="text"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          />

          {/* plan dropdown */}
          <select
            name="plan"
            defaultValue="Essentials"
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            <option value="Free">Free</option>
            <option value="Essentials">Essentials</option>
          </select>

          {/* background dropdown */}
          <select
            name="background"
            defaultValue=""
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-800 
                       dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
          >
            <option value="">Select your background</option>
            <option>New to trading</option>
            <option>Actively manual trade</option>
            <option>A Data Scientist looking to automate trade</option>
            <option>Algorithmic trading experience</option>
            <option>Quantitative Researcher/Developer</option>
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

        {/* <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-white/10" />
          <span className="text-neutral-400 text-xs">OR</span>
          <div className="flex-grow border-t border-white/10" />
        </div> */}

        {/* <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="border border-neutral-700 py-2 rounded hover:bg-neutral-800 transition text-sm w-full"
        >
          Continue with Google
        </button> */}

        <p className="text-center text-neutral-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-teal-400 hover:underline">
            Log in
          </a>
        </p>
      </div>

      <footer className="mt-16 text-center text-sm text-neutral-500 pb-8">
        © 2025 ApexQuantLabs — Built for systematic traders.
      </footer>
    </main>
  );
}