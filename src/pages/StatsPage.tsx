import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, List, History, Sparkles } from 'lucide-react';
import { useCloset } from '../context/ClosetContext';
import { GlassCard } from '../components/CommonUI';

export const StatsPage: React.FC = () => {
  const { items } = useCloset();

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const avgCpw = items.reduce((sum, item) => sum + (item.price / Math.max(1, item.usageCount)), 0) / Math.max(1, items.length);
  
  const categoryData = items.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.name === item.category);
    if (existing) existing.value++;
    else acc.push({ name: item.category, value: 1 });
    return acc;
  }, []);

  const usageData = items.slice(0, 7).map(item => ({
    name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name,
    count: item.usageCount
  })).sort((a, b) => b.count - a.count);

  const COLORS = ['#D4AF37', '#C0C0C0', '#F5F5DC', '#A0522D', '#2F4F4F', '#708090', '#4B0082'];

  return (
    <div className="pb-32 pt-12 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold mb-2">Collection Insights</h2>
        <p className="text-white/50">A comprehensive view of your luxury asset performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <GlassCard className="flex flex-col justify-between py-8">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Portfolio Value</div>
            <div className="text-3xl font-serif">${totalValue.toLocaleString()}</div>
          </div>
        </GlassCard>
        
        <GlassCard className="flex flex-col justify-between py-8">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Avg Cost Per Wear</div>
            <div className="text-3xl font-serif">${avgCpw.toFixed(2)}</div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between py-8">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
            <List className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Pieces</div>
            <div className="text-3xl font-serif">{items.length}</div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between py-8">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 mb-4">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Total Outfits Styled</div>
            <div className="text-3xl font-serif">124</div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 h-[400px]">
          <h3 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-8">Usage Frequency by Item</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                itemStyle={{ color: '#D4AF37' }}
              />
              <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-8 h-[400px] flex flex-col">
          <h3 className="text-sm font-medium uppercase tracking-widest text-white/40 mb-8">Category Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-12 p-8 glass-card border-none bg-gold/10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-gold/20 flex items-center justify-center text-gold">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-serif mb-1">Style Insight</h4>
            <p className="text-white/60 font-light">
              Your most worn category is <span className="text-gold font-bold">Watches</span>. 
              We recommend adding a <span className="text-gold font-bold">Silver Ring</span> to elevate your formal looks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
