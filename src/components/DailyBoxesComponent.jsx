// src/components/DailyBoxes.jsx
import React, { useState, useEffect } from "react";
import { getRandomItem } from "../utils/itemsData"; 
import s from "../styles/DailyBoxes.module.scss";
import { Link } from "react-router-dom"; 

export default function DailyBoxesComponent() {
  const GUEST_ID = 'guest'; 
  const [boxesOpened, setBoxesOpened] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reward, setReward] = useState(null); 

  const MAX_DAILY_BOXES = 3;
  
  const getTodayString = () => new Date().toISOString().split("T")[0];

  /**
   * Blokuje przewijanie strony, gdy modal nagrody jest otwarty.
   */
  useEffect(() => {
    if (reward) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [reward]); 

  /**
   * Ładuje stan dziennych skrzynek z LocalStorage.
   */
  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = () => {
    setLoading(true);
    
    const storedCount = localStorage.getItem(`boxes_${GUEST_ID}_count`);
    const storedDate = localStorage.getItem(`boxes_${GUEST_ID}_date`);
    const today = getTodayString();
    
    if (storedDate === today) {
      setBoxesOpened(parseInt(storedCount, 10) || 0);
    } else {
      setBoxesOpened(0);
      localStorage.setItem(`boxes_${GUEST_ID}_count`, 0);
      localStorage.setItem(`boxes_${GUEST_ID}_date`, today);
    }
    
    setLoading(false);
  };

  /**
   * Pobiera inwentarz z LocalStorage.
   */
  const getInventory = () => {
    const inventoryJson = localStorage.getItem(`inventory_${GUEST_ID}`);
    return inventoryJson ? JSON.parse(inventoryJson) : [];
  };

  /**
   * Zapisuje nowy stan inwentarza do LocalStorage.
   */
  const saveInventory = (newInventory) => {
    localStorage.setItem(`inventory_${GUEST_ID}`, JSON.stringify(newInventory));
  };

  const handleOpenBox = () => {
    if (boxesOpened >= MAX_DAILY_BOXES) return;

    const newItem = getRandomItem();
    const newCount = boxesOpened + 1;
    const today = getTodayString();

    // 1. Aktualizacja licznika skrzynek
    localStorage.setItem(`boxes_${GUEST_ID}_count`, newCount.toString());
    localStorage.setItem(`boxes_${GUEST_ID}_date`, today);
    setBoxesOpened(newCount);
    setReward(newItem); 

    // 2. Aktualizacja inwentarza
    const currentInventory = getInventory();
    const itemToAdd = {
        ...newItem,
        obtainedAt: new Date().toISOString(),
        id: newItem.id + "_" + Date.now() 
    };
    currentInventory.push(itemToAdd);
    saveInventory(currentInventory);
  };

  const closeRewardModal = () => {
    setReward(null);
  };

  if (loading) return <div className={s.container}>Ładowanie...</div>;

  return (
    <div className={s.container}>
      <h2>Twoje Eko-Pudełka</h2>
      <p>Otwarte dzisiaj: <strong>{boxesOpened} / {MAX_DAILY_BOXES}</strong></p>

      <div className={s.boxesGrid}>
        {[1, 2, 3].map((boxNum) => {
          const isOpened = boxNum <= boxesOpened;
          const isNext = boxNum === boxesOpened + 1;
          
          return (
            <div 
              key={boxNum} 
              className={`${s.box} ${isOpened ? s.opened : ''} ${isNext ? s.active : ''}`}
              onClick={isNext ? handleOpenBox : null}
            >
              <div className={s.icon}>{isOpened ? "✅" : "🎁"}</div>
              <span>{isOpened ? "Otwarta" : "Otwórz"}</span>
            </div>
          );
        })}
      </div>

      {boxesOpened === MAX_DAILY_BOXES && (
        <p className={s.comeBackText}>To wszystko na dziś! Wróć jutro po więcej.</p>
      )}

      {/* Модальне вікно нагороди */}
      {reward && (
        <div className={s.rewardOverlay}>
          <div className={s.rewardCard}>
            <h3>Znalazłeś przedmiot!</h3>
            <div className={s.rewardIcon}>{reward.icon}</div>
            <p className={s.rewardName}>{reward.name}</p>
            <span className={s.rewardType}>Typ: {reward.type}</span>
            <button onClick={closeRewardModal}>Dodaj do plecaka</button>
          </div>
        </div>
      )}
    </div>
  );
}