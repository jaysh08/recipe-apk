export interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  instructions: string;
  ingredients: { name: string; measure: string }[];
  youtubeUrl?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'spice' | 'vegetable' | 'protein' | 'dairy' | 'grain' | 'legume' | 'other';
}

// Common Indian ingredients for the selection UI
export const COMMON_INGREDIENTS: Ingredient[] = [
  // Spices
  { id: '1', name: 'Cumin', category: 'spice' },
  { id: '2', name: 'Turmeric', category: 'spice' },
  { id: '3', name: 'Coriander', category: 'spice' },
  { id: '4', name: 'Garam Masala', category: 'spice' },
  { id: '5', name: 'Chili Powder', category: 'spice' },
  { id: '6', name: 'Cardamom', category: 'spice' },
  { id: '7', name: 'Cinnamon', category: 'spice' },
  { id: '8', name: 'Cloves', category: 'spice' },
  { id: '9', name: 'Black Pepper', category: 'spice' },
  { id: '10', name: 'Fenugreek', category: 'spice' },
  { id: '11', name: 'Mustard Seeds', category: 'spice' },
  { id: '12', name: 'Fennel Seeds', category: 'spice' },
  // Vegetables
  { id: '13', name: 'Onion', category: 'vegetable' },
  { id: '14', name: 'Garlic', category: 'vegetable' },
  { id: '15', name: 'Ginger', category: 'vegetable' },
  { id: '16', name: 'Tomato', category: 'vegetable' },
  { id: '17', name: 'Potato', category: 'vegetable' },
  { id: '18', name: 'Cauliflower', category: 'vegetable' },
  { id: '19', name: 'Spinach', category: 'vegetable' },
  { id: '20', name: 'Green Chili', category: 'vegetable' },
  { id: '21', name: 'Bell Pepper', category: 'vegetable' },
  { id: '22', name: 'Carrot', category: 'vegetable' },
  { id: '23', name: 'Green Beans', category: 'vegetable' },
  { id: '24', name: 'Peas', category: 'vegetable' },
  { id: '25', name: 'Paneer', category: 'vegetable' },
  // Proteins
  { id: '26', name: 'Chicken', category: 'protein' },
  { id: '27', name: 'Lamb', category: 'protein' },
  { id: '28', name: 'Prawns', category: 'protein' },
  { id: '29', name: 'Fish', category: 'protein' },
  { id: '30', name: 'Eggs', category: 'protein' },
  // Dairy
  { id: '31', name: 'Yogurt', category: 'dairy' },
  { id: '32', name: 'Milk', category: 'dairy' },
  { id: '33', name: 'Ghee', category: 'dairy' },
  { id: '34', name: 'Cream', category: 'dairy' },
  { id: '35', name: 'Butter', category: 'dairy' },
  // Grains
  { id: '36', name: 'Rice', category: 'grain' },
  { id: '37', name: 'Flour', category: 'grain' },
  { id: '38', name: 'Bread', category: 'grain' },
  // Legumes
  { id: '39', name: 'Chickpeas', category: 'legume' },
  { id: '40', name: 'Lentils', category: 'legume' },
  { id: '41', name: 'Kidney Beans', category: 'legume' },
  { id: '42', name: 'Black Gram', category: 'legume' },
  // Other
  { id: '43', name: 'Coconut Milk', category: 'other' },
  { id: '44', name: 'Coconut', category: 'other' },
  { id: '45', name: 'Lemon', category: 'other' },
  { id: '46', name: 'Lime', category: 'other' },
  { id: '47', name: 'Sugar', category: 'other' },
  { id: '48', name: 'Honey', category: 'other' },
];