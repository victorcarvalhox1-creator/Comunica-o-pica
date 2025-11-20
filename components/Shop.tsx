import React, { useState } from 'react';
import { UserData, ShopItem } from '../types';
import { SHOP_ITEMS } from '../constants';
import { ShopIcon, CoinIcon, CheckCircleIcon } from './icons/Icons';

interface ShopProps {
  userData: UserData;
  onPurchaseItem: (item: ShopItem) => boolean;
  onEquipItem: (item: ShopItem) => void;
}

const ShopItemCard: React.FC<{
  item: ShopItem;
  isPurchased: boolean;
  isEquipped: boolean;
  canAfford: boolean;
  onPurchase: () => void;
  onEquip: () => void;
}> = ({ item, isPurchased, isEquipped, canAfford, onPurchase, onEquip }) => {
  const getButton = () => {
    if (isEquipped) {
      return (
        <button disabled className="w-full text-sm font-bold py-2 px-4 rounded-lg bg-gray-600 text-white flex items-center justify-center cursor-not-allowed">
          <CheckCircleIcon className="w-5 h-5 mr-2"/>
          Equipado
        </button>
      );
    }
    if (isPurchased) {
      return (
        <button onClick={onEquip} className="w-full text-sm font-bold py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition">
          Equipar
        </button>
      );
    }
    return (
      <button onClick={onPurchase} disabled={!canAfford} className="w-full text-sm font-bold py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white transition disabled:bg-gray-500 disabled:cursor-not-allowed">
        Comprar
      </button>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col justify-between text-center">
      <div>
        <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-600" style={{ backgroundColor: item.value }}></div>
        <h3 className="font-bold text-white">{item.name}</h3>
        {!isPurchased && (
          <div className="flex items-center justify-center text-yellow-400 my-2">
            <CoinIcon className="w-5 h-5 mr-1" />
            <span className="font-semibold">{item.cost}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        {getButton()}
      </div>
    </div>
  );
};

export const Shop: React.FC<ShopProps> = ({ userData, onPurchaseItem, onEquipItem }) => {
  const [feedback, setFeedback] = useState('');

  const handlePurchase = (item: ShopItem) => {
    const success = onPurchaseItem(item);
    if (success) {
        setFeedback(`'${item.name}' comprado com sucesso!`);
    } else {
        setFeedback('Moedas insuficientes ou item já comprado.');
    }
    setTimeout(() => setFeedback(''), 3000);
  };
  
  const backgroundItems = SHOP_ITEMS.filter(i => i.type === 'background');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShopIcon className="w-8 h-8 mr-3 text-purple-400" />
          <h1 className="text-2xl font-bold font-oxanium text-white">Loja</h1>
        </div>
        <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1 rounded-full">
            <CoinIcon className="w-5 h-5 text-yellow-400"/>
            <span className="font-bold text-lg">{userData.coins}</span>
        </div>
      </div>
       <p className="text-gray-400 mb-6">Use suas moedas para customizar seu avatar e sua jornada!</p>
       
       {feedback && <div className="mb-4 text-center p-2 rounded-md bg-purple-500/20 text-purple-200">{feedback}</div>}

       <div>
        <h2 className="text-xl font-bold font-oxanium text-white mb-3">Fundos para Avatar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {backgroundItems.map(item => (
                <ShopItemCard 
                    key={item.id}
                    item={item}
                    isPurchased={userData.purchasedItems.includes(item.id)}
                    isEquipped={userData.avatarCustomizations.backgroundColor === item.value}
                    canAfford={userData.coins >= item.cost}
                    onPurchase={() => handlePurchase(item)}
                    onEquip={() => onEquipItem(item)}
                />
            ))}
        </div>
       </div>
    </div>
  );
};