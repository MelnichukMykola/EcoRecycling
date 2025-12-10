export const RECYCLABLE_ITEMS = [
    { id: 'plastic_bottle', name: 'Plastikowa butelka', type: 'plastik', weight: 0.05, icon: '🥤', coinsValue: 2 },
    { id: 'glass_jar', name: 'Szklany słoik', type: 'szkło', weight: 0.2, icon: '🫙', coinsValue: 5 },
    { id: 'cardboard_box', name: 'Kartonowe pudełko', type: 'papier', weight: 0.1, icon: '📦', coinsValue: 3 },
    { id: 'can', name: 'Aluminiowa puszka', type: 'metal', weight: 0.02, icon: '🥫', coinsValue: 4 },
    { id: 'newspaper', name: 'Stara gazeta', type: 'papier', weight: 0.15, icon: '📰', coinsValue: 1 },
  ];
  
  export const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * RECYCLABLE_ITEMS.length);
    return RECYCLABLE_ITEMS[randomIndex];
  };