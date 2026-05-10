import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessoryItem, Category, Occasion } from '../types';

interface ClosetContextType {
  items: AccessoryItem[];
  addItem: (item: Omit<AccessoryItem, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateItem: (id: string, updates: Partial<AccessoryItem>) => void;
  deleteItem: (id: string) => void;
  incrementUsage: (id: string) => void;
  categories: Category[];
  occasions: Occasion[];
}

const ClosetContext = createContext<ClosetContextType | undefined>(undefined);

const MOCK_ITEMS: AccessoryItem[] = [
  {
    id: '1',
    name: 'Heritage Black Bay',
    brand: 'Tudor',
    color: 'Silver/Black',
    category: 'Watches',
    price: 3800,
    purchaseDate: '2023-11-15',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
    usageCount: 45,
    tags: ['Formal', 'Office', 'Wedding'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Aviator Classic',
    brand: 'Ray-Ban',
    color: 'Gold',
    category: 'Sunglasses',
    price: 180,
    purchaseDate: '2024-02-10',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    usageCount: 82,
    tags: ['Casual', 'Summer', 'Travel'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Monogram Keepall',
    brand: 'Louis Vuitton',
    color: 'Brown',
    category: 'Bags',
    price: 2500,
    purchaseDate: '2023-08-20',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    usageCount: 12,
    tags: ['Travel', 'Wedding'],
    createdAt: new Date().toISOString(),
  }
];

export const ClosetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<AccessoryItem[]>(() => {
    const saved = localStorage.getItem('stylesync_items');
    return saved ? JSON.parse(saved) : MOCK_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('stylesync_items', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<AccessoryItem, 'id' | 'createdAt' | 'usageCount'>) => {
    const newItem: AccessoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<AccessoryItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementUsage = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, usageCount: item.usageCount + 1 } : item)));
  };

  const categories: Category[] = [
    'Watches', 'Jewellery', 'Bracelets', 'Rings', 'Bags', 'Caps', 'Sunglasses', 'Belts'
  ];

  const occasions: Occasion[] = [
    'Formal', 'Casual', 'Party', 'Summer', 'Winter', 'Wedding', 'Travel', 'Office', 'Beach'
  ];

  return (
    <ClosetContext.Provider value={{ items, addItem, updateItem, deleteItem, incrementUsage, categories, occasions }}>
      {children}
    </ClosetContext.Provider>
  );
};

export const useCloset = () => {
  const context = useContext(ClosetContext);
  if (!context) throw new Error('useCloset must be used within a ClosetProvider');
  return context;
};
