export interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  instructions: string;
  ingredients: { name: string; measure: string }[];
  youtubeUrl?: string;
  // Extended fields for enhanced features
  description?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  steps?: string[]; // Step-by-step instructions as array
  tags?: string[]; // Additional tags for filtering
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'spice' | 'vegetable' | 'protein' | 'dairy' | 'grain' | 'legume' | 'other';
}

// Common Indian ingredients for the selection UI
export const COMMON_INGREDIENTS: Ingredient[] = [
  // Spices
  { id: '1', name: 'Cumin Seeds', category: 'spice' },
  { id: '2', name: 'Turmeric Powder', category: 'spice' },
  { id: '3', name: 'Coriander Powder', category: 'spice' },
  { id: '4', name: 'Garam Masala', category: 'spice' },
  { id: '5', name: 'Red Chili Powder', category: 'spice' },
  { id: '6', name: 'Cardamom', category: 'spice' },
  { id: '7', name: 'Cinnamon Stick', category: 'spice' },
  { id: '8', name: 'Cloves', category: 'spice' },
  { id: '9', name: 'Black Pepper', category: 'spice' },
  { id: '10', name: 'Fenugreek Seeds', category: 'spice' },
  { id: '11', name: 'Mustard Seeds', category: 'spice' },
  { id: '12', name: 'Fennel Seeds', category: 'spice' },
  { id: '13', name: 'Asafoetida', category: 'spice' },
  { id: '14', name: 'Cumin Seeds', category: 'spice' },
  { id: '15', name: 'Kashmiri Chili', category: 'spice' },
  // Vegetables
  { id: '16', name: 'Onion', category: 'vegetable' },
  { id: '17', name: 'Garlic', category: 'vegetable' },
  { id: '18', name: 'Ginger', category: 'vegetable' },
  { id: '19', name: 'Tomato', category: 'vegetable' },
  { id: '20', name: 'Potato', category: 'vegetable' },
  { id: '21', name: 'Cauliflower', category: 'vegetable' },
  { id: '22', name: 'Spinach', category: 'vegetable' },
  { id: '23', name: 'Green Chili', category: 'vegetable' },
  { id: '24', name: 'Bell Pepper', category: 'vegetable' },
  { id: '25', name: 'Carrot', category: 'vegetable' },
  { id: '26', name: 'Green Beans', category: 'vegetable' },
  { id: '27', name: 'Peas', category: 'vegetable' },
  { id: '28', name: 'Paneer', category: 'vegetable' },
  { id: '29', name: 'Eggplant', category: 'vegetable' },
  { id: '30', name: 'Cucumber', category: 'vegetable' },
  // Proteins
  { id: '31', name: 'Chicken', category: 'protein' },
  { id: '32', name: 'Lamb', category: 'protein' },
  { id: '33', name: 'Prawns', category: 'protein' },
  { id: '34', name: 'Fish', category: 'protein' },
  { id: '35', name: 'Eggs', category: 'protein' },
  { id: '36', name: 'Minced Meat', category: 'protein' },
  // Dairy
  { id: '37', name: 'Yogurt', category: 'dairy' },
  { id: '38', name: 'Milk', category: 'dairy' },
  { id: '39', name: 'Ghee', category: 'dairy' },
  { id: '40', name: 'Cream', category: 'dairy' },
  { id: '41', name: 'Butter', category: 'dairy' },
  { id: '42', name: 'Cottage Cheese', category: 'dairy' },
  // Grains
  { id: '43', name: 'Basmati Rice', category: 'grain' },
  { id: '44', name: 'Wheat Flour', category: 'grain' },
  { id: '45', name: 'Bread', category: 'grain' },
  { id: '46', name: 'Semolina', category: 'grain' },
  { id: '47', name: 'Bengal Gram Flour', category: 'grain' },
  // Legumes
  { id: '48', name: 'Chickpeas', category: 'legume' },
  { id: '49', name: 'Red Lentils', category: 'legume' },
  { id: '50', name: 'Kidney Beans', category: 'legume' },
  { id: '51', name: 'Black Gram', category: 'legume' },
  { id: '52', name: 'Yellow Lentils', category: 'legume' },
  // Other
  { id: '53', name: 'Coconut Milk', category: 'other' },
  { id: '54', name: 'Coconut', category: 'other' },
  { id: '55', name: 'Lemon', category: 'other' },
  { id: '56', name: 'Lime', category: 'other' },
  { id: '57', name: 'Sugar', category: 'other' },
  { id: '58', name: 'Honey', category: 'other' },
  { id: '59', name: 'Tamarind', category: 'other' },
  { id: '60', name: 'Cashews', category: 'other' },
  { id: '61', name: 'Almonds', category: 'other' },
  { id: '62', name: 'Raisins', category: 'other' },
  { id: '63', name: 'Sesame Seeds', category: 'other' },
  { id: '64', name: 'Poppy Seeds', category: 'other' },
];

// Recipe categories for filtering
export const RECIPE_CATEGORIES = [
  'All',
  'Main Dishes',
  'Biryani/Pulao',
  'South Indian',
  'Snacks',
  'Dal/Lentils',
  'Desserts'
] as const;