export default function BackgroundFX() {
  return (
    <>
      {/* soft radial glows */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(30% 30% at 20% 10%, rgba(59,130,246,0.15), rgba(0,0,0,0)), radial-gradient(50% 50% at 80% 80%, rgba(45,212,191,0.12), rgba(0,0,0,0))",
        }}
      />
      {/* fine grain */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />
    </>
  );
}
