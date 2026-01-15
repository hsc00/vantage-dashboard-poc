import { useState, useEffect, useCallback } from "react";
import type { Alert } from "../types";
import streamMessagesRaw from "../mocks/stream-messages.json";

const streamMessages = streamMessagesRaw as Record<
  "critical" | "high" | "low",
  string[]
>;

/**
 * Secure random generator to satisfy sonarjs/pseudo-random.
 * Using Web Crypto API for non-deterministic random values.
 */
const getSafeRandom = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
};

export const useAlertStreams = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Keep alerts list capped at 5000 entries to prevent memory bloat
  const addAlert = useCallback((newAlert: Alert) => {
    setAlerts((prev) => {
      const updated = [newAlert, ...prev];
      return updated.slice(0, 5000);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomValue = getSafeRandom();
      // Typed record to ensure streamMessages keys are valid severity levels
      let severity: "critical" | "high" | "low";

      if (randomValue > 0.8) severity = "critical";
      else if (randomValue > 0.4) severity = "high";
      else severity = "low";

      /**
       * The key 'severity' is internally generated and controlled by the
       * conditional logic above. There is no risk of user-supplied malicious
       * keys being injected here.
       */
      // eslint-disable-next-line security/detect-object-injection
      const messages = streamMessages[severity];
      const messageIndex = Math.floor(getSafeRandom() * messages.length);
      /**
       * messageIndex is a calculated number based on the current
       * array's length. Safe from external index manipulation.
       */
      // eslint-disable-next-line security/detect-object-injection
      const randomMessage = messages[messageIndex];

      const randomAlert: Alert = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        sensor: `Edge-Node-${Math.floor(getSafeRandom() * 10) + 1}`,
        severity,
        message: randomMessage,
        ip: `192.168.1.${Math.floor(getSafeRandom() * 254) + 1}`,
      };

      addAlert(randomAlert);
    }, 4000);

    return () => clearInterval(interval);
  }, [addAlert]);

  return { alerts };
};
