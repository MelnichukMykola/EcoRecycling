// src/components/RecyclingCalculator.jsx
import React, { useState } from 'react';
import { MATERIAL_VALUES } from '../utils/materialsData';
import { useCoins } from '../coins/useCoins'; 
import { useAuth } from '../auth/AuthContext'; 
import s from '../styles/RecyclingCalculator.module.scss';

export default function RecyclingCalculator() {
  // UWAGA: Musisz mieć działający useAuth()
  const { user } = useAuth(); 
  
  const userId = user?.uid || 'guest'; 

  const { addCoins } = useCoins(userId); 
  
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_VALUES[0].id);
  const [weight, setWeight] = useState('');
  const [resultCoins, setResultCoins] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const calculateValue = (matId, w) => {
    const material = MATERIAL_VALUES.find(m => m.id === matId);
    if (material && w > 0) {
      return Math.round(w * material.valuePerKg);
    }
    return 0;
  };

  const handleWeightChange = (e) => {
    const newWeightValue = e.target.value;
    const newWeight = parseFloat(newWeightValue);
    setWeight(newWeightValue);
    
    if (newWeight > 0) {
      const calculated = calculateValue(selectedMaterial, newWeight);
      setResultCoins(calculated);
    } else {
      setResultCoins(0);
    }
    setIsAdded(false);
  };

  const handleMaterialChange = (e) => {
    const newMaterialId = e.target.value;
    setSelectedMaterial(newMaterialId);
    
    const calculated = calculateValue(newMaterialId, parseFloat(weight));
    setResultCoins(calculated);
    setIsAdded(false);
  };
  
  const handleAddToPortfolio = () => {
    if (resultCoins <= 0) return;

    addCoins(resultCoins);
    
    setIsAdded(true);

    setTimeout(() => {
        setWeight('');
        setResultCoins(0);
    }, 1500); 
  };

  const currentMaterial = MATERIAL_VALUES.find(m => m.id === selectedMaterial);
  
  return (
    <div className={s.calculatorContainer}>
      <h2>Kalkulator Recyklingu</h2>
      <p className={s.description}>
        Wpisz wagę oddanych materiałów, aby natychmiast obliczyć, ile EcoCoins otrzymasz!
      </p>

      <div className={s.form}>
        {/* Wybór Materiału */}
        <div className={s.inputGroup}>
          <label htmlFor="material">Materiał:</label>
          <select 
            id="material" 
            value={selectedMaterial} 
            onChange={handleMaterialChange}
            className={s.select}
          >
            {MATERIAL_VALUES.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Waga */}
        <div className={s.inputGroup}>
          <label htmlFor="weight">Waga ({currentMaterial?.unit}):</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={handleWeightChange}
            placeholder="Wpisz wagę, np. 2.5"
            min="0"
            step="0.1"
            className={s.input}
          />
        </div>

        {/* Wynik i Przycisk */}
        <div className={s.resultBox}>
          <div className={s.resultText}>
            Otrzymasz: 
            <strong className={s.coinsValue}>
              {resultCoins} EcoCoins
            </strong>
          </div>
          
          <button 
            onClick={handleAddToPortfolio}
            disabled={resultCoins === 0 || isAdded} 
            className={s.addButton}
          >
            {isAdded ? "Dodano do portfela! ✅" : "Dodaj do portfela"}
          </button>
        </div>
        
        {/* Wyświetlanie komunikatu sukcesu */}
        {isAdded && (
            <p className={s.successMessage}>
                Pomyślnie dodano EcoCoins!
            </p>
        )}
      </div>
    </div>
  );
}