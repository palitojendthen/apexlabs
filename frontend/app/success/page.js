// export default function SuccessPage() {
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white">
//       <h1 className="text-3xl font-semibold mb-4">🎉 Payment Successful!</h1>
//       <p className="text-neutral-400 mb-6">
//         Thank you for subscribing to <span className="text-teal-400">ApexQuantLabs Essentials Beta</span>.
//       </p>
//       <a
//         href="/"
//         className="px-5 py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold hover:opacity-90 transition"
//       >
//         Go to Research Lab
//       </a>
//     </main>
//   );
// }




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

    // Redirect to dashboard/backtest page after short delay
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
