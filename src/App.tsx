import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Sparkles, PlusCircle, BarChart3, LogIn, ChevronRight, Apple, Globe } from 'lucide-react';
import { ClosetProvider } from './context/ClosetContext';
import { LandingPage } from './pages/LandingPage';
import { ClosetPage } from './pages/ClosetPage';
import { AddItemPage } from './pages/AddItemPage';
import { AISuggestionPage } from './pages/AISuggestionPage';
import { StatsPage } from './pages/StatsPage';
import { Button, GlassCard } from './components/CommonUI';

type View = 'landing' | 'login' | 'closet' | 'add' | 'ai' | 'stats';

function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-premium-black relative">
       <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full" />
       <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
       
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
         <GlassCard className="p-8 md:p-12">
           <div className="text-center mb-10">
             <h2 className="text-3xl font-serif font-bold italic text-gold mb-2">StyleSync</h2>
             <p className="text-white/40 text-sm tracking-widest uppercase">Luxury Access</p>
           </div>
           
           <div className="space-y-4">
             <Button variant="outline" className="w-full justify-between px-6" size="lg" onClick={onLogin}>
               <div className="flex items-center gap-3">
                 <Globe className="w-5 h-5 text-gold" />
                 <span>Continue with Google</span>
               </div>
               <ChevronRight className="w-4 h-4 opacity-30" />
             </Button>
             
             <Button variant="outline" className="w-full justify-between px-6" size="lg" onClick={onLogin}>
               <div className="flex items-center gap-3">
                 <Apple className="w-5 h-5" />
                 <span>Continue with Apple</span>
               </div>
               <ChevronRight className="w-4 h-4 opacity-30" />
             </Button>
           </div>

           <div className="relative my-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
             <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-4 bg-premium-black text-white/20">or</span></div>
           </div>

           <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
             <div className="space-y-4">
               <label className="block text-xs uppercase tracking-widest text-white/40">Private Key Email</label>
               <input type="email" placeholder="design@stylesync.luxury" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-gold/50" />
             </div>
             <Button type="submit" className="w-full" size="lg">Grant Access</Button>
           </form>

           <p className="text-center text-white/30 text-xs mt-10">
             By joining, you agree to our <span className="text-white/60">Privileged Terms</span>.
           </p>
         </GlassCard>
       </motion.div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onStart={() => setCurrentView(isLoggedIn ? 'closet' : 'login')} />;
      case 'login': return <LoginPage onLogin={() => { setIsLoggedIn(true); setCurrentView('closet'); }} />;
      case 'closet': return <ClosetPage onAddItem={() => setCurrentView('add')} onViewStats={() => setCurrentView('stats')} />;
      case 'add': return <AddItemPage onBack={() => setCurrentView('closet')} />;
      case 'ai': return <AISuggestionPage />;
      case 'stats': return <StatsPage />;
      default: return <LandingPage onStart={() => setCurrentView('login')} />;
    }
  };

  const showNav = ['closet', 'add', 'ai', 'stats'].includes(currentView);

  return (
    <ClosetProvider>
      <div className="min-h-screen bg-premium-black text-white selection:bg-gold/30">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>

        {/* Global Navigation - Bottom for Mobile, Desktop Floating */}
        {showNav && (
          <div className="fixed bottom-0 left-0 w-full z-50 p-6 md:pb-10 pointer-events-none">
            <motion.div 
              initial={{ y: 100 }} 
              animate={{ y: 0 }} 
              className="max-w-md mx-auto h-20 glass-card p-2 flex items-center justify-around pointer-events-auto rounded-[32px] border-white/10"
            >
              <NavButton 
                active={currentView === 'closet'} 
                onClick={() => setCurrentView('closet')}
                icon={<LayoutGrid className="w-6 h-6" />}
                label="Closet"
              />
              <NavButton 
                active={currentView === 'ai'} 
                onClick={() => setCurrentView('ai')}
                icon={<Sparkles className="w-6 h-6" />}
                label="Stylist"
              />
              <div className="relative -top-8">
                 <button 
                  onClick={() => setCurrentView('add')}
                  className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center shadow-2xl shadow-gold/40 active:scale-95 transition-transform"
                 >
                   <PlusCircle className="w-8 h-8" />
                 </button>
              </div>
              <NavButton 
                active={currentView === 'stats'} 
                onClick={() => setCurrentView('stats')}
                icon={<BarChart3 className="w-6 h-6" />}
                label="Stats"
              />
              <NavButton 
                active={currentView === 'login'} 
                onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); }}
                icon={<LogIn className="w-6 h-6 rotate-180" />}
                label="Exit"
              />
            </motion.div>
          </div>
        )}
      </div>
    </ClosetProvider>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-gold' : 'text-white/40 hover:text-white/70'}`}
    >
      {icon}
      <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
      {active && <motion.div layoutId="nav-glow" className="w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />}
    </button>
  );
}
