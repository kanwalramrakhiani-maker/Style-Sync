import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shirt, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { Button, GlassCard } from '../components/CommonUI';
import { getOutfitSuggestion, Suggestion } from '../services/geminiService';

export const AISuggestionPage: React.FC = () => {
  const { items, occasions } = useCloset();
  const [shirtColor, setShirtColor] = useState('Black');
  const [selectedOccasion, setSelectedOccasion] = useState('Dinner');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const handleGenerate = async () => {
    if (items.length === 0) return alert('Add items to your closet first!');
    setLoading(true);
    try {
      const result = await getOutfitSuggestion(items, shirtColor, selectedOccasion);
      setSuggestion(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Red', 'Blue', 'Green'];

  return (
    <div className="pb-32 pt-12 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif font-bold mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-gold w-8 h-8" /> Smart AI Stylist
        </h2>
        <p className="text-white/50 max-w-xl mx-auto font-light">
          Input your base outfit details and let our neural stylist select the perfect luxury accents from your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="md:col-span-1 space-y-8">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
              <Shirt className="w-3 h-3" /> Shirt / Top Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setShirtColor(color)}
                  className={`h-10 rounded-lg flex items-center justify-center text-[10px] transition-all border ${
                    shirtColor === color ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color.toLowerCase() }} />
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
              <MapPin className="w-3 h-3" /> Occasion
            </label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50 transition-colors"
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
            >
              {occasions.map(occ => <option key={occ} value={occ} className="bg-premium-black">{occ}</option>)}
            </select>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            disabled={loading}
            onClick={handleGenerate}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 mr-2" /> Style Me</>}
          </Button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {!suggestion && !loading ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] bg-white/2 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Shirt className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/30 italic font-serif text-lg">Define your look on the left to see recommendations.</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center"
              >
                <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
                <p className="text-white/50 tracking-widest uppercase text-xs animate-pulse">Analyzing style trends...</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4">
                     <Sparkles className="text-gold/20 w-32 h-32 rotate-12" />
                   </div>
                   <div className="relative z-10">
                     <h4 className="text-xs uppercase tracking-widest text-gold mb-4 font-bold">Stylist Recommendation</h4>
                     <p className="text-xl font-serif leading-relaxed text-white/90">
                       "{suggestion?.reasoning}"
                     </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {suggestion?.matchedItems.map((match, idx) => {
                    const fullItem = items.find(i => i.id === match.id);
                    if (!fullItem) return null;
                    return (
                      <GlassCard key={idx} className="p-4 flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={fullItem.image} alt={fullItem.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{fullItem.category}</div>
                          <div className="text-sm font-medium leading-tight">{fullItem.name}</div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                   <Button variant="ghost" onClick={handleGenerate} className="text-white/40 hover:text-white">
                     <RefreshCw className="w-4 h-4 mr-2" /> Try Another Concept
                   </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
