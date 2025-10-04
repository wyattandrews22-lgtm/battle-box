import React, { useState, useEffect } from "react";
import "./index.css";

const rarityColors = {
  Common: "#a8a8a8",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
};

// embedded chest sprite (tiny pixel art made with emoji squares)
const chestSprite = `
data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect width="32" height="32" fill="#6b3e26"/>
  <rect x="4" y="8" width="24" height="16" fill="#b87333"/>
  <rect x="4" y="12" width="24" height="2" fill="#4e2a17"/>
  <rect x="14" y="8" width="4" height="16" fill="#d9a066"/>
</svg>`)}
`;

// 20 sample pixel-art “weapon” placeholders (using simple color boxes)
const weaponSprites = Array.from({ length: 20 }, (_, i) => {
  const hue = (i * 18) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>
    <rect width='32' height='32' fill='hsl(${hue},70%,50%)'/>
    <rect x='12' y='8' width='8' height='16' fill='white'/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
});

const weaponList = Array.from({ length: 20 }, (_, i) => ({
  name: `Weapon ${i + 1}`,
  rarity: ["Common", "Rare", "Epic", "Legendary"][i % 4],
  sprite: weaponSprites[i],
}));

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [collection, setCollection] = useState([]);
  const [message, setMessage] = useState("Open a chest to start!");

  useEffect(() => {
    const saved = localStorage.getItem("battlebox_collection");
    if (saved) setCollection(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("battlebox_collection", JSON.stringify(collection));
  }, [collection]);

  function openChest() {
    const newWeapon = weaponList[Math.floor(Math.random() * weaponList.length)];
    setInventory([newWeapon]);
    if (!collection.find((w) => w.name === newWeapon.name)) {
      setCollection([...collection, newWeapon]);
    }
    setMessage(`You got a ${newWeapon.rarity} ${newWeapon.name}!`);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
        ⚔️ Battle Box ⚔️
      </h1>

      {/* Chest button */}
      <button
        onClick={openChest}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-lg mb-4"
      >
        <div
          className="inline-block w-8 h-8 mr-2 align-middle"
          style={{
            backgroundImage: `url(${chestSprite})`,
            backgroundSize: "cover",
            imageRendering: "pixelated",
          }}
        />
        Open Chest
      </button>

      <p className="mb-4 text-lg text-gray-300">{message}</p>

      {/* Inventory */}
      <div className="flex space-x-4 mb-6">
        {inventory.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-2 bg-gray-800 rounded-lg border-2"
            style={{ borderColor: rarityColors[item.rarity] }}
          >
            <img
              src={item.sprite}
              alt={item.name}
              className="w-12 h-12 image-pixelated"
            />
            <span className="text-sm mt-1">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Collection Book */}
      <h2 className="text-2xl mb-2">📖 Collection Book</h2>
      <div className="grid grid-cols-5 gap-2">
        {weaponList.map((weapon, i) => {
          const owned = collection.find((w) => w.name === weapon.name);
          return (
            <div
              key={i}
              className="w-16 h-16 border-2 rounded-lg flex items-center justify-center bg-gray-800"
              style={{
                borderColor: owned ? rarityColors[weapon.rarity] : "#333",
                opacity: owned ? 1 : 0.3,
              }}
            >
              <img
                src={weapon.sprite}
                alt={weapon.name}
                className="w-10 h-10 image-pixelated"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
