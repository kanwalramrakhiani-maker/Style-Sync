import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, X, Check, ArrowLeft } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { Button, GlassCard } from '../components/CommonUI';
import { Category, Occasion } from '../types';

interface AddItemPageProps {
  onBack: () => void;
}

export const AddItemPage: React.FC<AddItemPageProps> = ({ onBack }) => {
  const { categories, occasions, addItem } = useCloset();
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    color: '',
    category: 'Watches' as Category,
    price: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyExpiry: '',
    tags: [] as Occasion[],
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: Occasion) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Please upload an image');
    
    addItem({
      ...formData,
      price: Number(formData.price),
      image,
      tags: formData.tags
    });
    
    onBack();
  };

  return (
    <div className="pb-32 pt-8 px-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Closet
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Upload */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold">Add New Luxury Piece</h2>
          <p className="text-white/50 font-light">Capture the essence of your accessory. Premium visuals lead to better AI matching.</p>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/5] bg-white/5 rounded-3xl border-2 border-dashed border-white/10 hover:border-gold/30 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center group overflow-hidden relative"
          >
            {image ? (
              <>
                <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-12 h-12 text-white" />
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                  <Upload className="w-8 h-8 text-white/30 group-hover:text-gold transition-colors" />
                </div>
                <h4 className="text-lg font-medium mb-2">Upload Image</h4>
                <p className="text-sm text-white/30 max-w-[200px]">Drag & drop or click to select from gallery or camera</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-white/40">Product Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Classic Aviator"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Brand</label>
              <input 
                required
                type="text" 
                placeholder="Brand Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-premium-black">{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Price (USD)</label>
              <input 
                required
                type="number" 
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Color</label>
              <input 
                required
                type="text" 
                placeholder="Main Color"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Purchase Date</label>
              <input 
                required
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-white/40">Warranty Expiry</label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-white/40">Curator Notes</label>
            <textarea 
              placeholder="e.g. Gift from someone special, limited edition number..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors min-h-[100px]"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-white/40">Occasions / Tags</label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-xs transition-all border ${
                    formData.tags.includes(tag) 
                      ? 'bg-gold border-gold text-white' 
                      : 'border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Button type="submit" className="w-full" size="lg">
              <Check className="w-5 h-5 mr-2" /> Complete Collection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
