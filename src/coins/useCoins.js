import { useEffect, useState } from "react";

const KEY_PREFIX = "ecoapp:coins:";

export function useCoins(uid) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!uid) return;
    const key = KEY_PREFIX + uid;
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(
        key,
        JSON.stringify({ balance: 0, updatedAt: Date.now() })
      );
      setBalance(0);
      return;
    }
    try {
      const data = JSON.parse(raw);
      setBalance(typeof data?.balance === "number" ? data.balance : 0);
    } catch {
      setBalance(0);
    }
  }, [uid]);

  return { balance };
}
