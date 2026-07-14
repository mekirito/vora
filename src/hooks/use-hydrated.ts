"use client";

import { useEffect, useState } from "react";
import { useVoraStore } from "@/stores/vora-store";

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useVoraStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useVoraStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  return hydrated;
}
