import type { Recipe } from './types';

// Extended recipe type for sorting
type RecipeWithMatch = Recipe & { matchPercentage: number; matchedIngredients: string[]; missingIngredients: string[] };

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Fetch all Indian recipes
export async function fetchIndianRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/filter.php?a=Indian`);
  const data = await response.json();
  
  if (!data.meals) return [];
  
  // Get full details for each meal
  const recipes = await Promise.all(
    data.meals.slice(0, 30).map(async (meal: { idMeal: string }) => {
      return fetchRecipeById(meal.idMeal);
    })
  );
  
  return recipes.filter(Boolean);
}

// Fetch recipe details by ID
export async function fetchRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    const data = await response.json();
    
    if (!data.meals || data.meals.length === 0) return null;
    
    const meal = data.meals[0];
    return parseMealData(meal);
  } catch (error) {
    console.error(`Error fetching recipe ${id}:`, error);
    return null;
  }
}

// Search recipes by ingredient
export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
  const data = await response.json();
  
  if (!data.meals) return [];
  
  const recipes = await Promise.all(
    data.meals.slice(0, 10).map(async (meal: { idMeal: string }) => {
      return fetchRecipeById(meal.idMeal);
    })
  );
  
  return recipes.filter(Boolean);
}

// Parse raw API data into Recipe format
function parseMealData(meal: any): Recipe {
  const ingredients: { name: string; measure: string }[] = [];
  
  // TheMealDB stores ingredients as strIngredient1, strIngredient2, etc.
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || ''
      });
    }
  }
  
  return {
    id: meal.idMeal,
    name: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || '',
    area: meal.strArea || '',
    instructions: meal.strInstructions || '',
    ingredients,
    youtubeUrl: meal.strYoutube || undefined
  };
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