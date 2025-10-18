// "use client";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// export default function SuccessPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const email = localStorage.getItem("user_email");
//     if (email) {
//       fetch("/api/update-user-plan", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, plan_type: "Essentials_Beta" }),
//       });
//     }

//     // redirect to dashboard/backtest page after short delay
//     const timer = setTimeout(() => router.push("/"), 2500);
//     return () => clearTimeout(timer);
//   }, [router]);

//   return (
//     <main className="flex flex-col items-center justify-center h-screen text-center">
//       <h1 className="text-3xl font-semibold mb-4 text-teal-400">Payment Successful 🎉</h1>
//       <p className="text-neutral-400">
//         Your ApexQuantLabs Essentials Beta plan is now active.<br />
//         Redirecting you to your dashboard...
//       </p>
//     </main>
//   );
// }


"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderID = searchParams.get("token") || searchParams.get("orderID");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const email = localStorage.getItem("user_email");

    async function verifyPayment() {
      try {
        const res = await fetch("/api/verify_paypal_payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID, email }),
        });
        const data = await res.json();
        if (data.verified) {
          setStatus("success");
          setTimeout(() => router.push("/"), 2500);
        } else {
          setStatus("failed");
          setTimeout(() => router.push("/cancel"), 2500);
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("failed");
        setTimeout(() => router.push("/cancel"), 2500);
      }
    }

    if (orderID && email) verifyPayment();
  }, [router, orderID]);

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      {status === "verifying" && (
        <>
          <h1 className="text-3xl font-semibold mb-4 text-cyan-400">Verifying Payment...</h1>
          <p className="text-neutral-400">Please wait a moment while we confirm your transaction.</p>
        </>
      )}
      {status === "success" && (
        <>
          <h1 className="text-3xl font-semibold mb-4 text-teal-400">
            Payment Successful 🎉
          </h1>
          <p className="text-neutral-400">
            Your Essentials plan is now active.<br />
            Redirecting to dashboard...
          </p>
        </>
      )}
      {status === "failed" && (
        <>
          <h1 className="text-3xl font-semibold mb-4 text-red-400">
            Payment Failed ❌
          </h1>
          <p className="text-neutral-400">
            Something went wrong verifying your payment.<br />
            You will be redirected shortly.
          </p>
        </>
      )}
    </main>
  );
}