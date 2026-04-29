import { Recipe } from './types';

export const RECIPES: Recipe[] = [
  {
    id: 'burger',
    name: 'Classic Burger',
    basePoints: 100,
    ingredients: [
      { type: 'bun', state: 'raw' },
      { type: 'meat', state: 'cooked' },
      { type: 'lettuce', state: 'chopped' },
      { type: 'tomato', state: 'chopped' },
    ],
    levelUnlocks: [
      { level: 2, name: 'Cheese Burst', description: 'Adds Cheese to every burger', extraIngredients: [{ type: 'cheese', state: 'raw' }] },
      { level: 4, name: 'The Works', description: 'Adds Pickles & Grilled Onions', extraIngredients: [{ type: 'pickle', state: 'chopped' }, { type: 'onion', state: 'cooked' }] }
    ]
  },
  {
    id: 'salad',
    name: 'Fresh Salad',
    basePoints: 80,
    ingredients: [
      { type: 'lettuce', state: 'chopped' },
      { type: 'tomato', state: 'chopped' },
      { type: 'cheese', state: 'raw' },
    ],
    levelUnlocks: [
      { level: 3, name: 'Protein Pack', description: 'Adds Grilled Meat to salads', extraIngredients: [{ type: 'meat', state: 'cooked' }] }
    ]
  },
  {
    id: 'pasta',
    name: 'Tomato Pasta',
    basePoints: 120,
    ingredients: [
      { type: 'pasta', state: 'boiled' },
      { type: 'sauce', state: 'cooked' },
    ],
  },
  {
    id: 'steak',
    name: 'Steak & Fries',
    basePoints: 150,
    ingredients: [
      { type: 'meat', state: 'cooked' },
      { type: 'potato', state: 'fried' }, // Fries
    ],
  },
  {
    id: 'loaded_fries',
    name: 'Loaded Fries',
    basePoints: 180,
    ingredients: [
      { type: 'potato', state: 'fried' },
      { type: 'meat', state: 'cooked' },
      { type: 'cheese', state: 'raw' },
    ],
  },
  {
    id: 'deluxe_burger',
    name: 'Deluxe Burger',
    basePoints: 250,
    ingredients: [
      { type: 'bun', state: 'raw' },
      { type: 'meat', state: 'cooked' },
      { type: 'cheese', state: 'raw' },
      { type: 'tomato', state: 'chopped' },
      { type: 'lettuce', state: 'chopped' },
      { type: 'pickle', state: 'chopped' },
      { type: 'onion', state: 'cooked' },
    ],
  },
  {
    id: 'onion_rings',
    name: 'Onion Rings',
    basePoints: 120,
    ingredients: [
      { type: 'onion', state: 'fried' },
    ],
  },
  {
    id: 'salad_wrap',
    name: 'Grilled Chicken Wrap',
    basePoints: 200,
    ingredients: [
      { type: 'tortilla', state: 'cooked' },
      { type: 'meat', state: 'cooked' },
      { type: 'lettuce', state: 'chopped' },
      { type: 'tomato', state: 'chopped' },
      { type: 'cheese', state: 'raw' },
    ],
  },
];
