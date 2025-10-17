// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { useRef, useState } from "react";
// import ThemeToggle from "./ThemeToggle";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const closeTimeout = useRef(null);

//   const handleEnter = () => {
//     clearTimeout(closeTimeout.current);
//     setOpen(true);
//   };
//   const handleLeave = () => {
//     closeTimeout.current = setTimeout(() => setOpen(false), 150);
//   };
//   const toggleMenu = () => setOpen((o) => !o);

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-neutral-800">
//       <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
//         {/* lhs: logo + navigation */}
//         <div className="flex items-center gap-8">
//           {/* logo + brand */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <Image
//               src="/dummy_logo.png"
//               alt="ApexQuantLabs"
//               width={40}
//               height={40}
//               className="object-contain"
//               priority
//             />
//             <span className="font-semibold text-[20px] tracking-wide">
//               ApexQuantLabs
//             </span>
//           </Link>

//           {/* navigation links */}
//           <nav className="hidden sm:flex items-center gap-6 text-[16px] text-neutral-300 relative">
//             <Link
//               href="/about"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               About
//             </Link>

//             {/* features */}
//             <div
//               className="relative"
//               onMouseEnter={handleEnter}
//               onMouseLeave={handleLeave}
//             >
//               <button
//                 onClick={toggleMenu}
//                 className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all focus:outline-none flex items-center gap-1"
//               >
//                 Features <span className="text-xs">▾</span>
//               </button>

//               {open && (
//                 <div
//                   className="absolute left-0 mt-2 w-56 rounded-md bg-neutral-900 border border-neutral-700 shadow-lg"
//                   onMouseEnter={handleEnter}
//                   onMouseLeave={handleLeave}
//                 >
//                   <Link
//                     href="/"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Backtest
//                   </Link>
//                   <Link
//                     href="/features/live-strategies"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Live Strategies
//                   </Link>
//                   <Link
//                     href="/features/portfolio-management"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Portfolio Management
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link
//               href="/resources"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Resources
//             </Link>
//             <Link
//               href="/pricing"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Pricing
//             </Link>
//           </nav>
//         </div>

//         {/* rhs: login + themes */}
//         <div className="flex items-center gap-5">
//           <Link
//             href="/login"
//             className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-teal-400 transition-all"
//           >
//             Login
//           </Link>
//           <ThemeToggle />
//         </div>
//       </div>
//     </header>
//   );
// }



// "use client";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { auth } from "../../lib/firebaseClient";
// import ThemeToggle from "./ThemeToggle";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   // const [user, setUser] = useState(null);
//   const [user, setUser] = useState(undefined);
//   const closeTimeout = useRef(null);
//   const router = useRouter();

//   // detect Firebase login state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       console.log("Auth state changed", currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleEnter = () => {
//     clearTimeout(closeTimeout.current);
//     setOpen(true);
//   };
//   const handleLeave = () => {
//     closeTimeout.current = setTimeout(() => setOpen(false), 150);
//   };
//   const toggleMenu = () => setOpen((o) => !o);

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       router.push("/login");
//     } catch (err) {
//       console.error("Sign-out error:", err);
//       alert("Failed to sign out, please try again.");
//     }
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-neutral-800">
//       <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
//         {/* lhs: logo + navigation */}
//         <div className="flex items-center gap-8">
//           {/* logo + brand */}
//           <Link href="/" className="flex items-center gap-3 group">
//             <Image
//               src="/dummy_logo.png"
//               alt="ApexQuantLabs"
//               width={40}
//               height={40}
//               className="object-contain"
//               priority
//             />
//             <span className="font-semibold text-[20px] tracking-wide">
//               ApexQuantLabs
//             </span>
//           </Link>

//           {/* navigation links */}
//           <nav className="hidden sm:flex items-center gap-6 text-[16px] text-neutral-300 relative">
//             <Link
//               href="/about"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               About
//             </Link>

//             {/* features */}
//             <div
//               className="relative"
//               onMouseEnter={handleEnter}
//               onMouseLeave={handleLeave}
//             >
//               <button
//                 onClick={toggleMenu}
//                 className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all focus:outline-none flex items-center gap-1"
//               >
//                 Features <span className="text-xs">▾</span>
//               </button>

//               {open && (
//                 <div
//                   className="absolute left-0 mt-2 w-56 rounded-md bg-neutral-900 border border-neutral-700 shadow-lg"
//                   onMouseEnter={handleEnter}
//                   onMouseLeave={handleLeave}
//                 >
//                   <Link
//                     href="/"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Backtest
//                   </Link>
//                   <Link
//                     href="/features/live-strategies"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Live Strategies
//                   </Link>
//                   <Link
//                     href="/features/portfolio-management"
//                     className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
//                   >
//                     Portfolio Management
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link
//               href="/resources"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Resources
//             </Link>
//             <Link
//               href="/pricing"
//               className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Pricing
//             </Link>
//           </nav>
//         </div>

//         <div className="flex items-center gap-5">
//           {/* {user ? (
//             <button
//               onClick={handleSignOut}
//               className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-all"
//             >
//               Sign Out
//             </button>
//           ) : (
//             <Link
//               href="/login"
//               className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Login
//             </Link>
//           )} */}

//           {user === undefined ? (
//             <span className="text-neutral-500 text-sm">...</span> // or null
//           ) : user ? (
//             <button
//               onClick={handleSignOut}
//               className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-all"
//             >
//               Sign Out
//             </button>
//           ) : (
//             <Link
//               href="/login"
//               className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-teal-400 transition-all"
//             >
//               Login
//             </Link>
//           )}

          
//           <ThemeToggle />
//         </div>
//       </div>
//     </header>
//   );
// }



"use client";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useAuth } from "../../lib/AuthContext"; // ✅ use global context
import { auth } from "../../lib/firebaseClient";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);
  const router = useRouter();
  const { user, loading } = useAuth(); // ✅ global user state

  const handleEnter = () => {
    clearTimeout(closeTimeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 150);
  };
  const toggleMenu = () => setOpen((o) => !o);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Sign-out error:", err);
      alert("Failed to sign out, please try again.");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-neutral-800">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* lhs: logo + navigation */}
        <div className="flex items-center gap-8">
          {/* logo + brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/dummy_logo.png"
              alt="ApexQuantLabs"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="font-semibold text-[20px] tracking-wide">
              ApexQuantLabs
            </span>
          </Link>

          {/* navigation links */}
          <nav className="hidden sm:flex items-center gap-6 text-[16px] text-neutral-300 relative">
            <Link
              href="/about"
              className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
            >
              About
            </Link>

            {/* features */}
            <div
              className="relative"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <button
                onClick={toggleMenu}
                className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all focus:outline-none flex items-center gap-1"
              >
                Features <span className="text-xs">▾</span>
              </button>

              {open && (
                <div
                  className="absolute left-0 mt-2 w-56 rounded-md bg-neutral-900 border border-neutral-700 shadow-lg"
                  onMouseEnter={handleEnter}
                  onMouseLeave={handleLeave}
                >
                  <Link
                    href="/"
                    className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
                  >
                    Backtest
                  </Link>
                  <Link
                    href="/features/live-strategies"
                    className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
                  >
                    Live Strategies
                  </Link>
                  <Link
                    href="/features/portfolio-management"
                    className="block px-4 py-2 text-[15px] hover:bg-neutral-800 hover:text-teal-400 transition-all"
                  >
                    Portfolio Management
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/resources"
              className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
            >
              Resources
            </Link>
            <Link
              href="/pricing"
              className="px-2 py-1 rounded-md hover:bg-neutral-800 hover:text-teal-400 transition-all"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* rhs: auth + theme */}
        <div className="flex items-center gap-5">
          {loading ? (
            <span className="text-neutral-500 text-sm">...</span>
          ) : user ? (
            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-red-400 transition-all"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md text-[16px] text-neutral-300 hover:bg-neutral-800 hover:text-teal-400 transition-all"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}