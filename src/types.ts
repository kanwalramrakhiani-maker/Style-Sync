export type Category = 
  | 'Watches' 
  | 'Jewellery' 
  | 'Bracelets' 
  | 'Rings' 
  | 'Bags' 
  | 'Caps' 
  | 'Sunglasses' 
  | 'Belts';

export type Occasion = 
  | 'Formal' 
  | 'Casual' 
  | 'Party' 
  | 'Summer' 
  | 'Winter' 
  | 'Wedding' 
  | 'Travel'
  | 'Office'
  | 'Beach';

export interface AccessoryItem {
  id: string;
  name: string;
  brand: string;
  color: string;
  category: Category;
  price: number;
  purchaseDate: string;
  warrantyExpiry?: string;
  notes?: string;
  image: string;
  usageCount: number;
  tags: Occasion[];
  createdAt: string;
}

export interface UserStats {
  totalValue: number;
  mostWornId: string | null;
  leastWornId: string | null;
  monthlyUsage: { month: string; count: number }[];
  categoryBreakdown: { category: Category; count: number }[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
