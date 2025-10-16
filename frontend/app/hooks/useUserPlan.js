import { useEffect, useState } from "react";

export function useUserPlan() {
  const [plan, setPlan] = useState("Free");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/get_plan");
        if (!res.ok) return;
        const data = await res.json();
        setPlan(data.plan || "Free");
      } catch (err) {
        console.error("Failed to fetch plan:", err);
      }
    })();
  }, []);

  return plan;
}