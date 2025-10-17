"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) {
      fetch("/api/update-user-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan_type: "Essentials_Beta" }),
      });
    }

    // redirect to dashboard/backtest page after short delay
    const timer = setTimeout(() => router.push("/"), 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-semibold mb-4 text-teal-400">Payment Successful 🎉</h1>
      <p className="text-neutral-400">
        Your ApexQuantLabs Essentials Beta plan is now active.<br />
        Redirecting you to your dashboard...
      </p>
    </main>
  );
}
