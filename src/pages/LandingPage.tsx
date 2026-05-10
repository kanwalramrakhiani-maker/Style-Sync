import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, LayoutGrid, BarChart3, Camera, ShoppingBag } from 'lucide-react';
import { Button, GlassCard } from '../components/CommonUI';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-premium-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full animate-pulse" />

      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl font-serif font-bold tracking-widest text-gold italic">StyleSync</h1>
        <Button variant="ghost" size="sm" onClick={onStart}>Login / Join</Button>
      </nav>

      <main className="relative z-10 pt-32 px-6 max-w-7xl mx-auto">
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center mb-32"
        >
          <motion.h2 
            variants={item}
            className="text-5xl md:text-8xl font-serif font-bold mb-6 leading-tight"
          >
            Organize Your Style.<br />
            <span className="text-gold italic">Upgrade Your Look.</span>
          </motion.h2>
          
          <motion.p 
            variants={item}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
          >
            The world's most sophisticated digital closet for luxury accessories. 
            AI-powered styling meets premium organization.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onStart} className="group">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={onStart}>Explore Collection</Button>
          </motion.div>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-white/50 font-light">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </section>

        <section className="mb-32 text-center">
          <h3 className="text-3xl font-serif mb-12">The StyleSync Standard</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl font-serif text-gold font-bold">{stat.value}</div>
                <div className="text-white/40 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-serif font-bold text-gold italic">StyleSync</div>
          <div className="flex gap-8 text-white/40 text-sm">
            <a href="#" className="hover:text-gold transition-colors">Instagram</a>
            <a href="#" className="hover:text-gold transition-colors">Pinterest</a>
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          </div>
          <div className="text-white/20 text-xs">© 2026 StyleSync Luxury. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

const FEATURES = [
  { icon: <Sparkles />, title: "AI Outfit Suggestions", desc: "Our smart stylist recommends the perfect accessories based on your clothing and occasion." },
  { icon: <LayoutGrid />, title: "Digital Closet", desc: "High-resolution cataloging for your watches, jewelry, and luxury goods." },
  { icon: <Camera />, title: "AR Try-On", desc: "Virtually try on sunglasses and watches with cutting-edge augmented reality." },
  { icon: <BarChart3 />, title: "Usage Analytics", desc: "Track cost-per-wear and discover your most treasured pieces through data." },
  { icon: <ShoppingBag />, title: "Marketplace", desc: "Buy or sell authenticated pre-owned accessories within our exclusive community." },
  { icon: <Sparkles />, title: "Travel Assistant", desc: "Auto-generated packing lists for your next luxury destination." },
];

const STATS = [
  { value: "50K+", label: "Active Users" },
  { value: "1.2M", label: "Items Synced" },
  { value: "98%", label: "Styling Match" },
  { value: "Premium", label: "Experience" }
];
