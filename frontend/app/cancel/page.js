export default function CancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white">
      <h1 className="text-3xl font-semibold mb-4">❌ Payment Canceled</h1>
      <p className="text-neutral-400 mb-6">
        You can return to checkout or explore free tools anytime.
      </p>
      <a
        href="/pricing"
        className="px-5 py-2 rounded-md bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold hover:opacity-90 transition"
      >
        Back to Pricing
      </a>
    </main>
  );
}