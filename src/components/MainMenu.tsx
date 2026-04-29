import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Play, Award, Settings, ShoppingBag } from 'lucide-react';
import { clsx } from 'clsx';
import { cn } from '../lib/utils';

interface MainMenuProps {
  onStart: () => void;
  onOpenShop: () => void;
  persistentTips: number;
}

export default function MainMenu({ onStart, onOpenShop, persistentTips }: MainMenuProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen py-12 bg-[#2D3436] relative"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#636e72 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
        className="text-center mb-16 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="bg-brand-orange p-6 rounded-[2rem] shadow-[0_8px_0_#D35400] border-4 border-[#2D3436]"
          >
            <ChefHat size={100} className="text-[#2D3436]" />
          </motion.div>
        </div>
        <h1 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_0_#000] mb-2 leading-none">
          KITCHEN <span className="text-brand-orange">CHAOS</span>
        </h1>
        <div className="bg-brand-teal text-[#2D3436] px-6 py-2 rounded-full inline-block font-black text-sm uppercase tracking-[0.3em] shadow-lg">
          Master the Heat
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 w-72 relative z-10">
        <MenuButton 
          icon={<Play size={28} fill="currentColor" />} 
          label="START SHIFT" 
          onClick={onStart}
          primary
        />
        <div className="grid grid-cols-2 gap-4">
          <MenuButton 
            icon={<ShoppingBag size={24} />} 
            label="UPGRADES" 
            onClick={onOpenShop} 
            compact
          />
          <MenuButton 
            icon={<Settings size={24} />} 
            label="SETUP" 
            onClick={() => {}} 
            compact
          />
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <div className="bg-[#1E272E] px-6 py-2 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#95AFC0]">Bank Balance: <span className="text-white">${persistentTips}</span></span>
        </div>
        <div className="text-orange-200/30 text-[10px] font-mono tracking-widest uppercase">
          v1.1.0 // UPGRADE SYSTEM ACTIVE
        </div>
      </div>
    </motion.div>
  );
}

function MenuButton({ 
  icon, 
  label, 
  onClick, 
  primary = false,
  compact = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  primary?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-2xl font-black transition-all shadow-xl border-2 border-[#2D3436]",
        primary 
          ? "bg-brand-teal text-[#2D3436] py-6 shadow-[0_8px_0_#00B894] text-xl" 
          : "bg-brand-orange text-[#2D3436] py-4 shadow-[0_6px_0_#D35400] text-sm",
        compact ? "py-3 px-2" : "w-full px-6"
      )}
    >
      <div className={cn(compact ? "mb-0" : "mb-1")}>{icon}</div>
      <span className={cn("tracking-tighter uppercase font-black text-center leading-none", compact ? "text-[10px]" : "text-base")}>
        {label}
      </span>
    </motion.button>
  );
}
