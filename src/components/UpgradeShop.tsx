import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronLeft, ArrowUpCircle, Zap, Star } from 'lucide-react';
import { GameState, Recipe } from '../types';
import { RECIPES } from '../constants';
import { cn } from '../lib/utils';

interface UpgradeShopProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
}

const UPGRADE_COSTS = [50, 150, 400, 1000, 2500];

export default function UpgradeShop({ gameState, setGameState, onBack }: UpgradeShopProps) {
  const handleUpgrade = (recipeId: string) => {
    const currentLevel = gameState.recipeLevels[recipeId] || 0;
    const cost = UPGRADE_COSTS[currentLevel];

    if (gameState.persistentTips >= cost && currentLevel < UPGRADE_COSTS.length) {
      setGameState(prev => ({
        ...prev,
        persistentTips: prev.persistentTips - cost,
        recipeLevels: {
          ...prev.recipeLevels,
          [recipeId]: currentLevel + 1
        }
      }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-[#2D3436] p-8 relative flex flex-col items-center"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#636e72 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-brand-teal font-black uppercase tracking-tighter hover:scale-110 transition-transform bg-[#1E272E] px-4 py-2 rounded-xl border-2 border-white/5 shadow-lg"
          >
            <ChevronLeft size={24} />
            Back
          </button>
          
          <div className="text-center">
            <h2 className="text-4xl font-black italic tracking-tighter text-white drop-shadow-lg">CHEF UPGRADES</h2>
            <p className="text-brand-orange text-xs font-black uppercase tracking-[0.3em]">Master your craft</p>
          </div>

          <div className="bg-[#1E272E] px-6 py-3 rounded-2xl border-b-4 border-brand-teal shadow-xl flex items-center gap-3">
            <ShoppingBag className="text-brand-teal" size={24} />
            <div>
              <p className="text-[10px] text-[#95AFC0] font-black uppercase tracking-widest leading-none mb-1">Available Tips</p>
              <p className="text-2xl font-mono font-bold text-white">${gameState.persistentTips}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {RECIPES.map((recipe) => {
            const level = gameState.recipeLevels[recipe.id] || 0;
            const isMax = level >= UPGRADE_COSTS.length;
            const cost = UPGRADE_COSTS[level];
            const canAfford = gameState.persistentTips >= cost;

            return (
              <motion.div 
                key={recipe.id}
                whileHover={{ y: -5 }}
                className="bg-[#1E272E] p-6 rounded-[2rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star size={64} className="text-white" />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">{recipe.name}</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-6 h-1 rounded-full",
                            i < level ? "bg-brand-teal shadow-[0_0_8px_#55EFC4]" : "bg-[#2D3436]"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-brand-teal/10 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest">
                       LVL {level}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-white/60">
                    <Zap size={14} className="text-brand-orange" />
                    <span className="text-xs font-bold">Base Points: <span className="text-white">{recipe.basePoints + (level * 20)}</span> (+{level * 20})</span>
                  </div>

                  {recipe.levelUnlocks?.map((unlock) => (
                    <div 
                      key={unlock.level} 
                      className={cn(
                        "flex items-start gap-2 p-2 rounded-lg border",
                        level >= unlock.level 
                          ? "bg-brand-teal/5 border-brand-teal/20 text-brand-teal" 
                          : "bg-black/20 border-white/5 text-white/30"
                      )}
                    >
                      <Star size={12} className={cn("mt-1 shrink-0", level >= unlock.level ? "fill-brand-teal" : "")} />
                      <div>
                         <p className="text-[10px] font-black uppercase leading-tight">{unlock.name} <span className="opacity-50">(LVL {unlock.level})</span></p>
                         <p className="text-[9px] font-medium leading-tight">{unlock.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={isMax || !canAfford}
                  onClick={() => handleUpgrade(recipe.id)}
                  className={cn(
                    "w-full py-4 rounded-xl font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 border-b-4",
                    isMax 
                      ? "bg-[#2D3436] text-white/30 border-transparent cursor-not-allowed"
                      : canAfford
                        ? "bg-brand-orange text-[#2D3436] border-[#D35400] hover:bg-orange-400 active:translate-y-1 active:border-b-0"
                        : "bg-[#2D3436] text-[#95AFC0] border-[#1E272E] opacity-50"
                  )}
                >
                  {isMax ? (
                    "MAX LEVEL"
                  ) : (
                    <>
                      <ArrowUpCircle size={20} />
                      Upgrade for ${cost}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
