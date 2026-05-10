import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, MoreVertical, Eye, Heart, TrendingUp, X, Calendar, ShieldCheck, FileText, Edit2, Trash2, Check } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { Button, GlassCard } from '../components/CommonUI';
import { Category, AccessoryItem, Occasion } from '../types';

interface ClosetPageProps {
  onAddItem: () => void;
  onViewStats: () => void;
}

export const ClosetPage: React.FC<ClosetPageProps> = ({ onAddItem, onViewStats }) => {
  const { items, categories, occasions, updateItem, deleteItem } = useCloset();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedItem = items.find(i => i.id === selectedItemId);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpdate = (updates: Partial<AccessoryItem>) => {
    if (selectedItemId) {
      updateItem(selectedItemId, updates);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (selectedItemId && confirm('Are you sure you want to remove this piece from your collection?')) {
      deleteItem(selectedItemId);
      setSelectedItemId(null);
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">My Digital Closet</h2>
          <p className="text-white/50">{items.length} premium pieces curated</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="md" onClick={onViewStats} className="hidden md:flex">
            <TrendingUp className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button size="md" onClick={onAddItem}>
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search brand, name..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-12 focus:outline-none focus:border-gold/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'bg-gold text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-gold text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedItemId(item.id)}
              className="cursor-pointer"
            >
              <GlassCard className="p-0 group rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-premium-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1 py-2 backdrop-blur-md border-white/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="flex-1 py-2 backdrop-blur-md border-white/10">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform">
                    <button className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium truncate pr-2">{item.name}</h3>
                    <span className="text-gold text-sm whitespace-nowrap">${item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/40 uppercase tracking-widest">
                    <span>{item.brand}</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] uppercase tracking-widest text-white/30">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-gold/50" />
                      Worn {item.usageCount} times
                    </div>
                    <div>
                      CPW: ${(item.price / Math.max(1, item.usageCount)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <DetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => { setSelectedItemId(null); setIsEditing(false); }}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        categories={categories}
        occasions={occasions}
      />

      {filteredItems.length === 0 && (
        <div className="text-center py-32">
          <p className="text-white/30 italic font-serif text-lg">No items found in your collection.</p>
        </div>
      )}
    </div>
  );
};

interface DetailModalProps {
  item?: AccessoryItem;
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onUpdate: (updates: Partial<AccessoryItem>) => void;
  onDelete: () => void;
  categories: Category[];
  occasions: Occasion[];
}

const DetailModal: React.FC<DetailModalProps> = ({ 
  item, isOpen, onClose, isEditing, setIsEditing, onUpdate, onDelete, categories, occasions 
}) => {
  const [formData, setFormData] = useState<Partial<AccessoryItem>>({});

  React.useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:h-[600px] z-[101] overflow-hidden"
          >
            <GlassCard className="h-full p-0 flex flex-col md:flex-row border-white/20 shadow-2xl" hoverEffect={false}>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left: Product Image */}
              <div className="w-full md:w-1/2 h-64 md:h-full relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-4xl font-serif font-bold text-white mb-2">{item.name}</h2>
                  <p className="text-gold tracking-[0.2em] font-light uppercase text-sm">{item.brand}</p>
                </div>
              </div>

              {/* Right: Content */}
              <div className="w-full md:w-1/2 h-full bg-premium-gray p-8 md:p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-serif text-gold italic">Refine Details</h3>
                        <Button variant="ghost" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                          <InputField label="Brand" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-[10px] uppercase tracking-widest text-white/40">Category</label>
                             <select 
                               className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none"
                               value={formData.category}
                               onChange={e => setFormData({...formData, category: e.target.value as Category})}
                             >
                               {categories.map(c => <option key={c} value={c} className="bg-premium-black">{c}</option>)}
                             </select>
                           </div>
                           <InputField label="Price ($)" value={formData.price?.toString()} type="number" onChange={v => setFormData({...formData, price: Number(v)})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <InputField label="Color" value={formData.color} onChange={v => setFormData({...formData, color: v})} />
                           <InputField label="Warranty Expiry" value={formData.warrantyExpiry} type="date" onChange={v => setFormData({...formData, warrantyExpiry: v})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-white/40">Notes</label>
                           <textarea 
                             className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none min-h-[80px]"
                             value={formData.notes}
                             onChange={e => setFormData({...formData, notes: e.target.value})}
                           />
                        </div>
                      </div>

                      <div className="pt-6 flex gap-4">
                        <Button className="flex-1" onClick={() => onUpdate(formData)}>
                          <Check className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                        <button onClick={onDelete} className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                       <div className="flex justify-between items-center">
                         <div className="text-3xl font-serif tracking-tight">${item.price.toLocaleString()}</div>
                         <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                           <Edit2 className="w-4 h-4 mr-2" /> Edit Piece
                         </Button>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pb-8 border-b border-white/5">
                         <InfoItem icon={<Calendar className="w-4 h-4" />} label="Purchased" value={item.purchaseDate} />
                         <InfoItem icon={<ShieldCheck className="w-4 h-4" />} label="Warranty" value={item.warrantyExpiry || 'N/A'} />
                         <InfoItem icon={<TrendingUp className="w-4 h-4" />} label="Usage" value={`${item.usageCount} Times`} />
                         <InfoItem icon={<Eye className="w-4 h-4" />} label="Category" value={item.category} />
                       </div>

                       <div className="space-y-4">
                         <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
                           <FileText className="w-3 h-3" /> Curator Notes
                         </h4>
                         <p className="text-white/60 font-light leading-relaxed">
                           {item.notes || "No additional notes recorded for this piece in the archive."}
                         </p>
                       </div>

                       <div className="space-y-4">
                         <h4 className="text-xs uppercase tracking-widest text-white/40">Registered Occasions</h4>
                         <div className="flex flex-wrap gap-2">
                           {item.tags.map(tag => (
                             <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60">
                               {tag}
                             </span>
                           ))}
                         </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="text-gold/50">{icon}</div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.1em] text-white/30">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }: { label: string, value?: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest text-white/40">{label}</label>
      <input 
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-gold/30 transition-colors"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

