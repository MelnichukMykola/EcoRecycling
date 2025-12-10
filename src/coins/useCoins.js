import { useEffect, useState, useCallback } from "react";

const KEY_PREFIX = "ecoapp:coins:";

const balanceUpdaters = new Set(); 
const notifyBalanceChange = () => {
    balanceUpdaters.forEach(callback => callback());
};

export function useCoins(uid) {
  const [balance, setBalance] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); 

  const loadBalance = useCallback((currentUid) => {
    if (!currentUid) return 0;
    const key = KEY_PREFIX + currentUid;
    const raw = localStorage.getItem(key);
    
    if (!raw) {
      localStorage.setItem(
        key,
        JSON.stringify({ balance: 0, updatedAt: Date.now() })
      );
      return 0;
    }
    
    try {
      const data = JSON.parse(raw);
      return typeof data?.balance === "number" ? data.balance : 0;
    } catch {
      return 0;
    }
  }, []);


  useEffect(() => {
    if (!uid) return;
    
    setBalance(loadBalance(uid));

    const forceUpdate = () => setRefreshKey(prev => prev + 1);
    balanceUpdaters.add(forceUpdate);

    return () => {
        balanceUpdaters.delete(forceUpdate);
    };

  }, [uid, loadBalance, refreshKey]); 

  
  const addCoins = useCallback((amountToAdd) => {
    if (!uid || typeof amountToAdd !== 'number' || amountToAdd <= 0) return;
    
    const key = KEY_PREFIX + uid;
    
    setBalance(prevBalance => {
      const newBalance = prevBalance + amountToAdd;
      
      // Zapis do localStorage
      const newData = JSON.stringify({ balance: newBalance, updatedAt: Date.now() });
      localStorage.setItem(key, newData);
      
      notifyBalanceChange(); 
      
      return newBalance;
    });
  }, [uid]);

  return { balance, addCoins }; 
}