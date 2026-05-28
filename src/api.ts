import type { Recipe } from './types';
import { LOCAL_RECIPES } from './data/recipes';

// Extended recipe type for sorting
type RecipeWithMatch = Recipe & { matchPercentage: number; matchedIngredients: string[]; missingIngredients: string[] };

// Fetch all Indian recipes from local database
export async function fetchIndianRecipes(): Promise<Recipe[]> {
  // Return local recipes (instant, no network required)
  return LOCAL_RECIPES;
}

// Fetch recipe details by ID from local database
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  const recipe = LOCAL_RECIPES.find(r => r.id === id);
  return recipe || null;
}

// Search recipes by ingredient (returns matching recipes)
export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
  const lowerIngredient = ingredient.toLowerCase();
  return LOCAL_RECIPES.filter(recipe => 
    recipe.ingredients.some(ing => 
      ing.name.toLowerCase().includes(lowerIngredient)
    )
  );
}

// Calculate match percentage between user ingredients and recipe ingredients
export function calculateMatchPercentage(
  userIngredients: string[],
  recipeIngredients: { name: string; measure: string }[]
): { percentage: number; matchedIngredients: string[]; missingIngredients: string[] } {
  if (userIngredients.length === 0) {
    return {
      percentage: 0,
      matchedIngredients: [],
      missingIngredients: recipeIngredients.map(i => i.name)
    };
  }
  
  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase().trim());
  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];
  
  for (const ingredient of recipeIngredients) {
    const ingredientName = ingredient.name.toLowerCase().trim();
    const isMatched = normalizedUserIngredients.some(
      userIng => 
        ingredientName.includes(userIng) || 
        userIng.includes(ingredientName) ||
        fuzzyMatch(userIng, ingredientName)
    );
    
    if (isMatched) {
      matchedIngredients.push(ingredient.name);
    } else {
      missingIngredients.push(ingredient.name);
    }
  }
  
  const percentage = recipeIngredients.length > 0 
    ? Math.round((matchedIngredients.length / recipeIngredients.length) * 100)
    : 0;
  
  return { percentage, matchedIngredients, missingIngredients };
}

// Simple fuzzy matching for ingredient names
function fuzzyMatch(input: string, target: string): boolean {
  const inputWords = input.split(/\s+/);
  const targetWords = target.split(/\s+/);
  
  return inputWords.some(inputWord => 
    targetWords.some(targetWord => 
      targetWord.startsWith(inputWord.slice(0, 3)) ||
      inputWord.startsWith(targetWord.slice(0, 3))
    )
  );
}

// Sort recipes by match percentage
export function sortRecipesByMatch(
  recipes: RecipeWithMatch[],
  descending = true
): RecipeWithMatch[] {
  return [...recipes].sort((a, b) => 
    descending 
      ? b.matchPercentage - a.matchPercentage 
      : a.matchPercentage - b.matchPercentage
  );
}