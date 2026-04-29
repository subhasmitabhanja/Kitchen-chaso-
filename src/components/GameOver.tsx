import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { GameState } from '../types';

interface GameOverProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function GameOver({ gameState, onRestart }: GameOverProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen py-12 bg-[#2D3436] relative"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#636e72 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="bg-[#1E272E] p-12 rounded-[3rem] border-b-[12px] border-brand-orange shadow-2xl text-center max-w-md w-full relative z-10 border-4 border-white/5">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-8"
        >
          <Trophy size={100} className="text-brand-orange drop-shadow-[0_0_20px_rgba(255,159,67,0.5)]" />
        </motion.div>
        
        <h2 className="text-6xl font-black text-white mb-2 italic tracking-tighter drop-shadow-lg">SHIFT OVER!</h2>
        <p className="text-brand-teal mb-8 uppercase tracking-[0.3em] font-black text-xs">The kitchen is closed</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#2D3436] p-6 rounded-3xl shadow-inner border border-white/5">
            <p className="text-[10px] text-[#95AFC0] font-black uppercase mb-1 tracking-widest">Final Revenue</p>
            <p className="text-4xl font-mono font-bold text-brand-teal">${gameState.score}</p>
          </div>
          <div className="bg-[#2D3436] p-6 rounded-3xl shadow-inner border border-white/5">
            <p className="text-[10px] text-[#95AFC0] font-black uppercase mb-1 tracking-widest">Tips Earned</p>
            <p className="text-4xl font-mono font-bold text-brand-orange">${gameState.tips}</p>
          </div>
        </div>

        <div className="bg-[#2D3436]/50 p-3 rounded-2xl border border-white/5 mb-10 flex items-center justify-between px-6">
           <span className="text-[10px] font-black text-[#95AFC0] uppercase tracking-widest">Total Savings</span>
           <span className="text-brand-teal font-mono font-bold">${gameState.persistentTips}</span>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-4 bg-brand-teal hover:bg-brand-teal-dark text-[#2D3436] font-black py-5 rounded-2xl transition-all shadow-[0_6px_0_#00B894] active:translate-y-1 active:shadow-none text-xl uppercase italic tracking-tighter"
          >
            <RotateCcw size={28} />
            BACK TO SERVICE
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 bg-[#2D3436] hover:bg-[#333] text-white/50 font-black py-4 rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            <Home size={20} />
            RETURN TO MENU
          </button>
        </div>
      </div>
    </motion.div>
  );
}
