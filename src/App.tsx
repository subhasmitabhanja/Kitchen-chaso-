/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Clock, 
  Utensils, 
  Flame, 
  ShoppingBasket, 
  Trophy, 
  ChevronRight,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameState, Order, Ingredient, IngredientType, CookingState } from './types';
import { RECIPES } from './constants';
import { cn, formatTime } from './lib/utils';

// Components
import GameView from './components/GameView';
import MainMenu from './components/MainMenu';
import GameOver from './components/GameOver';
import UpgradeShop from './components/UpgradeShop';

export default function App() {
  const [view, setView] = useState<'menu' | 'playing' | 'gameover' | 'shop'>('menu');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    tips: 0,
    level: 1,
    orders: [],
    inventory: [],
    isGameOver: false,
    gameTime: 120, // 2 minutes per level
    recipeLevels: {},
    persistentTips: 0,
  });

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      tips: 0,
      level: 1,
      orders: [],
      inventory: [],
      isGameOver: false,
      gameTime: 120,
    }));
    setView('playing');
  };

  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      persistentTips: prev.persistentTips + prev.tips
    }));
    setView('gameover');
  }, []);

  useEffect(() => {
    if (view === 'playing' && gameState.gameTime > 0) {
      const timer = setInterval(() => {
        setGameState(prev => {
          if (prev.gameTime <= 1) {
            clearInterval(timer);
            endGame();
            return { ...prev, gameTime: 0 };
          }
          return { ...prev, gameTime: prev.gameTime - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view, gameState.gameTime, endGame]);

  return (
    <div className="min-h-screen bg-[#2D3436] text-white font-sans selection:bg-brand-orange/30">
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <MainMenu 
            onStart={startGame} 
            key="menu" 
            onOpenShop={() => setView('shop')}
            persistentTips={gameState.persistentTips}
          />
        )}
        
        {view === 'shop' && (
          <UpgradeShop 
            gameState={gameState} 
            setGameState={setGameState} 
            onBack={() => setView('menu')}
            key="shop"
          />
        )}
        
        {view === 'playing' && (
          <GameView 
            gameState={gameState} 
            setGameState={setGameState} 
            onEnd={endGame} 
            key="game"
          />
        )}
        
        {view === 'gameover' && (
          <GameOver 
            gameState={gameState} 
            onRestart={startGame} 
            key="gameover"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
