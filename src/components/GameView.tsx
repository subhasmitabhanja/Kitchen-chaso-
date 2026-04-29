import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Clock, 
  DollarSign, 
  Utensils, 
  ChefHat, 
  Plus, 
  Flame,
  HandMetal,
  Trash2,
  CheckCircle2,
  ShoppingBasket
} from 'lucide-react';
import { GameState, Order, Ingredient, IngredientType, CookingState } from '../types';
import { RECIPES } from '../constants';
import { cn, formatTime } from '../lib/utils';
import confetti from 'canvas-confetti';

interface GameViewProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onEnd: () => void;
}

const INGREDIENT_DATA: Record<IngredientType, { emoji: string; color: string; label: string }> = {
  tomato: { emoji: '🍅', color: 'bg-red-500', label: 'Tomato' },
  lettuce: { emoji: '🥬', color: 'bg-green-500', label: 'Lettuce' },
  cheese: { emoji: '🧀', color: 'bg-yellow-400', label: 'Cheese' },
  meat: { emoji: '🥩', color: 'bg-rose-700', label: 'Meat' },
  bun: { emoji: '🍞', color: 'bg-orange-300', label: 'Bun' },
  potato: { emoji: '🥔', color: 'bg-yellow-700', label: 'Potato' },
  pasta: { emoji: '🍝', color: 'bg-yellow-100', label: 'Pasta' },
  sauce: { emoji: '🥫', color: 'bg-red-700', label: 'Sauce' },
  pickle: { emoji: '🥒', color: 'bg-green-700', label: 'Pickle' },
  onion: { emoji: '🧅', color: 'bg-purple-200', label: 'Onion' },
  tortilla: { emoji: '🫓', color: 'bg-yellow-200', label: 'Tortilla' },
};

export default function GameView({ gameState, setGameState, onEnd }: GameViewProps) {
  const [activePrep, setActivePrep] = useState<Ingredient | null>(null);
  const [platingArea, setPlatingArea] = useState<Ingredient[]>([]);
  const [stationAction, setStationAction] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Add orders periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.orders.length >= 4) return prev;
        
        const randomRecipe = RECIPES[Math.floor(Math.random() * RECIPES.length)];
        const level = prev.recipeLevels[randomRecipe.id] || 0;
        
        let ingredients = [...randomRecipe.ingredients];
        if (randomRecipe.levelUnlocks) {
          randomRecipe.levelUnlocks.forEach(unlock => {
            if (level >= unlock.level && unlock.extraIngredients) {
              ingredients = [...ingredients, ...unlock.extraIngredients];
            }
          });
        }

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          recipeId: randomRecipe.id,
          recipeName: randomRecipe.name,
          ingredients: ingredients,
          totalTime: 45,
          timeLeft: 45,
          status: 'pending',
        };
        
        return {
          ...prev,
          orders: [...prev.orders, newOrder]
        };
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [setGameState]);

  // Order timer
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        orders: prev.orders.map(order => ({
          ...order,
          timeLeft: Math.max(0, order.timeLeft - 1)
        })).filter(order => {
            if (order.timeLeft <= 0) return false; // Expired
            return true;
        })
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [setGameState]);

  const addIngredient = (type: IngredientType) => {
    if (activePrep) return;
    const newIngredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      state: 'raw',
    };
    setActivePrep(newIngredient);
  };

  const startAction = (action: 'chop' | 'cook' | 'boil' | 'fry') => {
    if (!activePrep || stationAction) return;

    // Logic for what can be done
    if (action === 'chop' && activePrep.state === 'raw' && ['tomato', 'lettuce', 'potato', 'pickle', 'onion'].includes(activePrep.type)) {
      setStationAction('Chopping...');
    } else if (action === 'cook' && (
      (activePrep.type === 'meat' && activePrep.state === 'raw') || 
      (activePrep.type === 'sauce' && activePrep.state === 'raw') ||
      (activePrep.type === 'onion' && activePrep.state === 'raw') ||
      (activePrep.type === 'tortilla' && activePrep.state === 'raw')
    )) {
      setStationAction('Cooking...');
    } else if (action === 'boil' && activePrep.type === 'pasta' && activePrep.state === 'raw') {
      setStationAction('Boiling...');
    } else if (action === 'fry' && (activePrep.state === 'chopped' || activePrep.state === 'raw') && ['potato', 'onion'].includes(activePrep.type)) {
      setStationAction('Frying...');
    } else {
      return; // Invalid action
    }

    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setActivePrep(prev => {
          if (!prev) return null;
          let newState = prev.state;
          if (action === 'chop') newState = 'chopped';
          if (action === 'cook') newState = 'cooked';
          if (action === 'boil') newState = 'boiled';
          if (action === 'fry') newState = 'fried';
          return { ...prev, state: newState };
        });
        setStationAction(null);
        setProgress(0);
      }
    }, 200);
  };

  const plateIngredient = () => {
    if (!activePrep) return;
    setPlatingArea(prev => [...prev, activePrep]);
    setActivePrep(null);
  };

  const serveOrder = () => {
    // Check if platingArea matches any order
    const matchingOrderIndex = gameState.orders.findIndex(order => {
      if (order.ingredients.length !== platingArea.length) return false;
      
      const orderNeeds = [...order.ingredients];
      const itemsInPlate = [...platingArea];
      
      return orderNeeds.every(need => {
        const foundIndex = itemsInPlate.findIndex(item => item.type === need.type && item.state === need.state);
        if (foundIndex > -1) {
          itemsInPlate.splice(foundIndex, 1);
          return true;
        }
        return false;
      });
    });

    if (matchingOrderIndex > -1) {
      const order = gameState.orders[matchingOrderIndex];
      const recipe = RECIPES.find(r => r.id === order.recipeId);
      const level = gameState.recipeLevels[order.recipeId] || 0;
      const points = (recipe?.basePoints || 100) + (level * 20);
      const tip = Math.floor(order.timeLeft / 5);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        tips: prev.tips + tip,
        orders: prev.orders.filter((_, i) => i !== matchingOrderIndex)
      }));
      
      setPlatingArea([]);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      // Wrong dish!
      setStationAction('REJECTED!');
      setTimeout(() => setStationAction(null), 1000);
    }
  };

  const clearPlate = () => {
    setPlatingArea([]);
  };

  const getMatchedRecipe = () => {
    if (platingArea.length === 0) return null;
    
    return RECIPES.find(recipe => {
      const level = gameState.recipeLevels[recipe.id] || 0;
      let targetIngredients = [...recipe.ingredients];
      
      if (recipe.levelUnlocks) {
        recipe.levelUnlocks.forEach(unlock => {
          if (level >= unlock.level && unlock.extraIngredients) {
            targetIngredients = [...targetIngredients, ...unlock.extraIngredients];
          }
        });
      }

      if (targetIngredients.length !== platingArea.length) return false;
      const recipeNeeds = [...targetIngredients];
      const itemsInPlate = [...platingArea];
      
      return recipeNeeds.every(need => {
        const foundIndex = itemsInPlate.findIndex(item => item.type === need.type && item.state === need.state);
        if (foundIndex > -1) {
          itemsInPlate.splice(foundIndex, 1);
          return true;
        }
        return false;
      });
    });
  };

  const matchedRecipe = getMatchedRecipe();

  return (
    <div className="min-h-screen flex flex-col bg-[#2D3436] relative">
       {/* Dot Grid Background Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#636e72 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Header Stat Bar */}
      <header className="h-20 bg-[#1E272E] border-b-4 border-brand-orange flex items-center justify-between px-8 relative z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-brand-orange px-4 py-1.5 rounded-xl shadow-[0_4px_0_#D35400] flex items-center gap-2">
            <ChefHat size={20} className="text-[#2D3436]" />
            <span className="text-xl font-black italic uppercase text-[#2D3436]">LEVEL 0{gameState.level}</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#95AFC0]">Total Revenue</span>
            <span className="text-3xl font-mono font-bold text-brand-teal">${gameState.score + gameState.tips}</span>
          </div>
        </div>
        
        {/* Centered Timer HUD */}
        <div className="absolute left-1/2 -translate-x-1/2 bg-[#1E272E] border-4 border-brand-orange px-10 py-2 rounded-b-3xl shadow-2xl z-40">
           <div className="flex items-center gap-3">
             <Clock size={24} className="text-brand-orange animate-pulse" />
             <span className="text-4xl font-black text-white drop-shadow-[0_2px_0_#000] font-mono tracking-tighter">
               {formatTime(gameState.gameTime)}
             </span>
           </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center bg-[#2D3436] px-4 py-2 rounded-full border-2 border-[#636E72] shadow-inner">
            <div className="w-3 h-3 bg-brand-red rounded-full mr-2 shadow-[0_0_8px_#FF7675] animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-tight text-[#95AFC0]">Live System</span>
          </div>
          <button 
            onClick={onEnd}
            className="bg-brand-teal text-[#2D3436] font-black px-6 py-2 rounded-xl shadow-[0_4px_0_#00B894] hover:translate-y-1 hover:shadow-none transition-all active:scale-95 text-sm uppercase"
          >
            END SHIFT
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Orders Bar */}
        <div className="h-40 bg-[#2D3436]/80 flex items-center px-8 gap-6 overflow-hidden border-b-2 border-white/5 relative z-20">
          <div className="absolute left-0 h-full w-20 bg-gradient-to-r from-[#2D3436] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 h-full w-20 bg-gradient-to-l from-[#2D3436] to-transparent z-10 pointer-events-none"></div>
          
          <AnimatePresence>
            {gameState.orders.map((order, idx) => {
              const colors = idx % 2 === 0 ? 'bg-[#FAB1A0]' : 'bg-[#81ECEC]';
              return (
                <motion.div 
                  key={order.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="min-w-[200px] h-32 bg-white rounded-2xl p-4 flex flex-col relative shadow-[0_8px_0_#BDC3C7] shrink-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={cn("text-[10px] font-black text-[#2D3436] px-2 py-1 rounded-full uppercase tracking-tighter", colors)}>
                      {order.recipeName}
                    </span>
                    <span className="text-[#2D3436] font-black text-sm">${RECIPES.find(r => r.id === order.recipeId)?.basePoints}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {order.ingredients.map((ing, i) => (
                      <div key={i} className="w-6 h-6 bg-[#F1F2F6] rounded-lg flex items-center justify-center text-sm shadow-sm border border-[#DCDDE1]">
                         {INGREDIENT_DATA[ing.type].emoji}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto w-full bg-[#ECF0F1] h-2.5 rounded-full overflow-hidden border border-[#BDC3C7]/20">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: `${(order.timeLeft / order.totalTime) * 100}%` }}
                      className={cn(
                        "h-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]",
                        order.timeLeft < 15 ? "bg-brand-red" : "bg-[#FDCB6E]"
                      )}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {gameState.orders.length === 0 && (
            <div className="flex-1 h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-white/20 font-black uppercase tracking-[0.3em] text-sm italic">Waiting for incoming orders...</span>
            </div>
          )}
        </div>

        {/* Main Kitchen Floor */}
        <div className="flex-1 bg-[#F5F6FA] relative p-8">
           <div className="w-full h-full border-[12px] border-[#DCDDE1] rounded-[48px] bg-[#F1F2F6] shadow-[inset_0_4px_20px_rgba(0,0,0,0.1)] flex flex-col p-8 relative overflow-hidden">
              {/* Floor Pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd)', backgroundSize: '100px 100px', backgroundPosition: '0 0, 50px 50px' }}></div>
              
              <div className="relative z-10 flex-1 grid grid-cols-12 gap-8">
                 {/* Left Work Zone */}
                 <div className="col-span-8 grid grid-cols-2 gap-6">
                    {/* Active Slot */}
                    <div className="bg-[#BDC3C7] rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center shadow-xl border-b-[10px] border-[#95A5A6] p-6">
                        <div className="absolute top-4 right-6 bg-white/30 px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#2D3436]">PREP_SLOT 01</div>
                        
                        <AnimatePresence mode="wait">
                          {activePrep ? (
                            <motion.div 
                              key={activePrep.id}
                              initial={{ scale: 0.8, y: 20 }}
                              animate={{ scale: 1, y: 0 }}
                              className="flex flex-col items-center w-full"
                            >
                              <div className="w-32 h-32 bg-[#2F3640] rounded-full border-4 border-[#7F8C8D] flex items-center justify-center relative shadow-2xl mb-8">
                                 <span className="text-6xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{INGREDIENT_DATA[activePrep.type].emoji}</span>
                                 <div className="absolute -bottom-3 bg-brand-teal text-[#2D3436] px-3 py-1 rounded-full text-xs font-black uppercase shadow-lg border-2 border-[#2D3436]">
                                    {activePrep.state}
                                 </div>
                              </div>
                              <div className="flex gap-3 w-full max-w-[200px]">
                                <button 
                                  onClick={() => setActivePrep(null)}
                                  className="flex-1 bg-brand-red text-white p-3 rounded-2xl shadow-[0_4px_0_#D35400] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center"
                                >
                                  <Trash2 size={20} />
                                </button>
                                <button 
                                  onClick={plateIngredient}
                                  className="flex-[2] bg-brand-teal text-[#2D3436] p-3 rounded-2xl shadow-[0_4px_0_#00B894] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 font-black text-xs uppercase"
                                >
                                  <Utensils size={16} />
                                  PLATE IT
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex flex-col items-center opacity-30">
                               <ShoppingBasket size={64} className="text-[#2D3436] mb-4" />
                               <span className="text-xs font-black uppercase tracking-widest text-[#2D3436]">Awaiting Input</span>
                            </div>
                          )}
                        </AnimatePresence>

                        {stationAction && (
                           <div className="absolute inset-0 bg-[#2D3436]/90 flex flex-col items-center justify-center p-8 backdrop-blur-md z-20">
                              <div className="text-brand-orange font-black italic mb-6 animate-bounce text-3xl uppercase tracking-tighter drop-shadow-lg">
                                {stationAction}
                              </div>
                              <div className="w-full max-w-[240px] h-5 bg-white/10 rounded-full overflow-hidden border-2 border-white/20 p-1">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  className="h-full bg-brand-teal rounded-full shadow-[0_0_15px_#55EFC4]"
                                />
                              </div>
                           </div>
                        )}
                    </div>

                    {/* Interactive Stations */}
                    <LegacyStation 
                      icon="🔪" 
                      label="CHOP STATION" 
                      onClick={() => startAction('chop')}
                      active={activePrep?.state === 'raw' && ['tomato', 'lettuce', 'potato', 'pickle', 'onion'].includes(activePrep?.type || '')}
                      color="bg-[#E67E22]"
                      shadowColor="#D35400"
                    />

                    <LegacyStation 
                      icon="♨️" 
                      label="STOVE TOP" 
                      onClick={() => startAction('cook')}
                      active={activePrep?.state === 'raw' && ['meat', 'sauce', 'onion', 'tortilla'].includes(activePrep?.type || '')}
                      color="bg-[#2D3436]"
                      shadowColor="#000000"
                      isHot
                    />

                    <LegacyStation 
                      icon="🍟" 
                      label="DEEP FRYER" 
                      onClick={() => startAction('fry')}
                      active={(activePrep?.state === 'raw' || activePrep?.state === 'chopped') && ['potato', 'onion'].includes(activePrep?.type || '')}
                      color="bg-[#F1C40F]"
                      shadowColor="#F39C12"
                      isHot
                    />

                    <LegacyStation 
                      icon="🍲" 
                      label="BOIL POT" 
                      onClick={() => startAction('boil')}
                      active={activePrep?.type === 'pasta' && activePrep?.state === 'raw'}
                      color="bg-[#3498DB]"
                      shadowColor="#2980B9"
                    />
                 </div>

                 {/* Right: Plating & Recipes */}
                 <div className="col-span-4 flex flex-col gap-6">
                    {/* Plating Area */}
                    <div className={cn(
                      "bg-white rounded-[2.5rem] border-b-[10px] border-[#BDC3C7] shadow-xl flex-1 flex flex-col p-6 items-center transition-all",
                      matchedRecipe ? "border-brand-teal ring-4 ring-brand-teal/20" : ""
                    )}>
                       <div className="text-[10px] font-black uppercase text-[#95AFC0] tracking-widest mb-1">Plating Station</div>
                       
                       {matchedRecipe && (
                         <motion.div 
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="bg-brand-teal text-[#2D3436] px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 flex items-center gap-1 shadow-sm"
                         >
                            <CheckCircle2 size={12} />
                            Ready: {matchedRecipe.name}
                         </motion.div>
                       )}

                       <div className="flex-1 flex flex-wrap content-center justify-center gap-2 items-center bg-[#F1F2F6] rounded-3xl w-full border-4 border-dashed border-[#DCDDE1] p-4 relative overflow-hidden mb-4">
                           <AnimatePresence>
                              {platingArea.map((ing, i) => (
                                <motion.div 
                                  key={`${ing.id}-${i}`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-12 h-12 bg-white rounded-xl shadow-md border-2 border-[#DCDDE1] flex items-center justify-center text-2xl relative"
                                >
                                   {INGREDIENT_DATA[ing.type].emoji}
                                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-teal rounded-full flex items-center justify-center text-[6px] font-black uppercase text-[#2D3436]">
                                      {ing.state[0]}
                                   </div>
                                </motion.div>
                              ))}
                           </AnimatePresence>
                           {platingArea.length === 0 && (
                             <div className="text-center text-[#BDC3C7] font-black uppercase text-[10px] tracking-widest p-4">
                               Clear for plating
                             </div>
                           )}
                       </div>

                       <div className="flex gap-3 w-full">
                          <button 
                            onClick={serveOrder}
                            disabled={platingArea.length === 0}
                            className="flex-[2] bg-[#2ECC71] hover:bg-[#27AE60] disabled:opacity-30 disabled:grayscale transition-all text-white rounded-2xl font-black italic flex items-center justify-center gap-2 py-4 shadow-[0_6px_0_#27AE60] active:translate-y-1 active:shadow-none uppercase tracking-tighter"
                          >
                            <CheckCircle2 size={24} />
                            SERVE!
                          </button>
                          <button 
                            onClick={clearPlate}
                            disabled={platingArea.length === 0}
                            className="flex-1 bg-[#F1F2F6] text-[#BDC3C7] hover:text-brand-red p-4 rounded-2xl transition-all flex items-center justify-center border-2 border-transparent hover:border-brand-red/20"
                          >
                            <Trash2 size={24} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Pantry Footer */}
        <footer className="h-40 py-2 bg-[#1E272E] border-t-4 border-brand-teal flex items-center px-8 gap-4 z-40">
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-teal scrollbar-track-transparent">
              {(Object.entries(INGREDIENT_DATA) as [IngredientType, any][]).map(([type, data]) => (
                <motion.button
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 2 }}
                  key={type}
                  onClick={() => addIngredient(type)}
                  disabled={!!activePrep}
                  className={cn(
                    "w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all shadow-lg active:translate-y-1",
                    activePrep 
                      ? "bg-black/20 border-white/5 opacity-30 grayscale cursor-not-allowed" 
                      : "bg-brand-bg border-white/10 hover:border-brand-teal shadow-[0_4px_0_rgba(0,0,0,0.3)]"
                  )}
                >
                  <span className="text-3xl mb-1">{data.emoji}</span>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-[#95AFC0]">{type}</span>
                </motion.button>
              ))}
           </div>
           
           <div className="ml-auto bg-[#2D3436] px-6 py-4 rounded-2xl border-2 border-brand-orange/40 shadow-xl min-w-[200px]">
             <div className="flex items-center gap-2 mb-1">
               <ChefHat size={14} className="text-brand-orange" />
               <span className="text-xs font-black uppercase tracking-widest text-[#95AFC0]">Recipe Mode</span>
             </div>
             <div className="text-sm font-black text-white italic">FAST_TRACK PRODUCTION</div>
           </div>
        </footer>
      </div>
    </div>
  );
}

function LegacyStation({ icon, label, onClick, active, color, shadowColor, isHot = false }: { icon: string, label: string, onClick: () => void, active: boolean, color: string, shadowColor: string, isHot?: boolean }) {
  return (
    <motion.button
      whileHover={active ? { scale: 1.02 } : {}}
      whileTap={active ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!active}
      className={cn(
        "rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center shadow-xl p-8 border-b-[10px] transition-all",
        color,
        active ? `cursor-pointer border-[${shadowColor}]` : "opacity-30 border-black/20 grayscale"
      )}
      style={active ? { borderBottomColor: shadowColor } : {}}
    >
      <div className="absolute top-2 right-4 text-[8px] font-black opacity-30 uppercase tracking-widest">{label}</div>
      <div className={cn(
        "w-24 h-24 rounded-full flex items-center justify-center text-5xl relative",
        isHot && active ? "bg-[#E17055] shadow-[0_0_30px_#E17055] animate-pulse" : "bg-[#F1F2F6]/10"
      )}>
        {icon}
      </div>
      <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/80">{active ? 'Action Ready' : 'Standby'}</span>
    </motion.button>
  );
}

function Station({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick: () => void, active: boolean }) {
  return (
    <motion.button
      whileHover={active ? { scale: 1.02 } : {}}
      whileTap={active ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={!active}
      className={cn(
        "bg-[#222] rounded-3xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all group",
        active 
          ? "border-orange-500/50 cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.1)]" 
          : "border-white/5 opacity-40 cursor-not-allowed grayscale"
      )}
    >
      <div className={cn(
        "mb-2 transition-transform duration-500",
        active ? "text-orange-500 group-hover:scale-110" : "text-gray-600"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      {active && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-500/20">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-1/2 h-full bg-orange-500"
          />
        </div>
      )}
    </motion.button>
  );
}
