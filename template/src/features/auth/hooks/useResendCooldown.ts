import { useCallback, useEffect, useState } from "react";

import {
  RESEND_COOLDOWN_SECONDS,
  useOtpCooldownStore,
} from "@/stores/otpCooldownStore";

function computeRemaining(expiry: number | undefined): number {
  if (!expiry) {
    return 0;
  }

  return Math.max(Math.ceil((expiry - Date.now()) / 1000), 0);
}

// Persisted per-key resend cooldown that survives screen remounts and app restarts.
export function useResendCooldown(key: string) {
  const expiry = useOtpCooldownStore((state) => state.expiries[key]);
  const startCooldown = useOtpCooldownStore((state) => state.startCooldown);

  const [remaining, setRemaining] = useState(() => computeRemaining(expiry));

  useEffect(() => {
    setRemaining(computeRemaining(expiry));

    if (!expiry) {
      return;
    }

    const timer = setInterval(() => {
      const next = computeRemaining(expiry);
      setRemaining(next);

      if (next === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  const start = useCallback(() => {
    startCooldown(key, RESEND_COOLDOWN_SECONDS);
  }, [key, startCooldown]);

  return { remaining, isActive: remaining > 0, start };
}
