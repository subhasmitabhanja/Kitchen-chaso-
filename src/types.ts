export type IngredientType = 
  | 'tomato' 
  | 'lettuce' 
  | 'cheese' 
  | 'meat' 
  | 'bun' 
  | 'potato' 
  | 'pasta' 
  | 'sauce'
  | 'pickle'
  | 'onion'
  | 'tortilla';

export type CookingState = 'raw' | 'chopped' | 'cooked' | 'burnt' | 'boiled' | 'fried';

export interface Ingredient {
  id: string;
  type: IngredientType;
  state: CookingState;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { type: IngredientType; state: CookingState }[];
  basePoints: number;
  levelUnlocks?: {
    level: number;
    name: string;
    description: string;
    extraIngredients?: { type: IngredientType; state: CookingState }[];
  }[];
}

export interface Order {
  id: string;
  recipeId: string;
  recipeName: string;
  ingredients: { type: IngredientType; state: CookingState }[];
  timeLeft: number;
  totalTime: number;
  status: 'pending' | 'completed' | 'expired';
}

export interface GameState {
  score: number;
  tips: number;
  level: number;
  orders: Order[];
  inventory: Ingredient[];
  isGameOver: boolean;
  gameTime: number;
  recipeLevels: Record<string, number>;
  persistentTips: number;
}
