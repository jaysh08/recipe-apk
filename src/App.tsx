import { useState, useEffect } from 'react';
import './App.css';
import type { Recipe } from './types';
import { COMMON_INGREDIENTS } from './types';
import { fetchIndianRecipes, calculateMatchPercentage, sortRecipesByMatch } from './api';

// Recipe type extended with match percentage
type RecipeWithMatch = Recipe & { matchPercentage: number; matchedIngredients: string[]; missingIngredients: string[] };

function App() {
  const [recipes, setRecipes] = useState<RecipeWithMatch[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    loadRecipes();
    // Trigger entrance animation
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (recipes.length > 0 && selectedIngredients.length > 0) {
      updateRecipeMatches();
    }
  }, [selectedIngredients, recipes]);

  async function loadRecipes() {
    setIsLoading(true);
    try {
      const data = await fetchIndianRecipes();
      const recipesWithMatch = data.map(recipe => ({
        ...recipe,
        matchPercentage: 0,
        matchedIngredients: [],
        missingIngredients: recipe.ingredients.map(i => i.name)
      }));
      setRecipes(recipesWithMatch);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function updateRecipeMatches() {
    const updatedRecipes = recipes.map(recipe => {
      const matchResult = calculateMatchPercentage(selectedIngredients, recipe.ingredients);
      return {
        ...recipe,
        ...matchResult
      };
    });
    
    const sorted = sortRecipesByMatch(updatedRecipes);
    setRecipes(sorted);
  }

  function addIngredient(ingredientName: string) {
    if (!selectedIngredients.includes(ingredientName)) {
      setSelectedIngredients([...selectedIngredients, ingredientName]);
    }
    setSearchQuery('');
  }

  function removeIngredient(ingredientName: string) {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredientName));
  }

  function clearAllIngredients() {
    setSelectedIngredients([]);
  }

  function openRecipeDetail(recipe: RecipeWithMatch) {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  }

  function closeRecipeDetail() {
    setShowDetail(false);
    setTimeout(() => setSelectedRecipe(null), 300);
  }

  const filteredIngredients = COMMON_INGREDIENTS.filter(
    ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
           !selectedIngredients.includes(ing.name)
  ).slice(0, 8);

  const hasIngredients = selectedIngredients.length > 0;
  const displayRecipes = hasIngredients 
    ? recipes.filter(r => r.matchPercentage > 0)
    : recipes;

  return (
    <div className="app">
      {/* Header */}
      <header className={`header ${pageLoaded ? 'loaded' : ''}`}>
        <h1>🍲 Recipe Finder</h1>
        <p>Discover delicious Indian recipes with ingredients you have</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Ingredient Selection */}
        <section className={`ingredient-section ${pageLoaded ? 'loaded' : ''}`}>
          <h2>What's in your pantry?</h2>
          
          <div className="ingredient-input-wrapper">
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ingredient-search"
            />
            
            {searchQuery && filteredIngredients.length > 0 && (
              <div className="ingredient-dropdown">
                {filteredIngredients.map(ingredient => (
                  <button
                    key={ingredient.id}
                    className="dropdown-item"
                    onClick={() => addIngredient(ingredient.name)}
                  >
                    <span className="category-badge">{ingredient.category}</span>
                    {ingredient.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="selected-ingredients">
              {selectedIngredients.map((ingredient, index) => (
                <span
                  key={ingredient}
                  className="ingredient-chip"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {ingredient}
                  <button
                    className="remove-btn"
                    onClick={() => removeIngredient(ingredient)}
                    aria-label={`Remove ${ingredient}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button className="clear-all-btn" onClick={clearAllIngredients}>
                Clear All
              </button>
            </div>
          )}
        </section>

        {/* Recipe Grid */}
        <section className="recipes-section">
          <div className="section-header">
            <h2>{hasIngredients ? 'Matching Recipes' : 'Indian Recipes'}</h2>
            {hasIngredients && (
              <span className="match-count">
                {displayRecipes.length} {displayRecipes.length === 1 ? 'recipe' : 'recipes'} found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : displayRecipes.length === 0 ? (
            <div className="no-recipes">
              <p>No matching recipes found. Try adding more ingredients!</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {displayRecipes.map((recipe, index) => (
                <article
                  key={recipe.id}
                  className="recipe-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => openRecipeDetail(recipe)}
                >
                  <div className="recipe-image-wrapper">
                    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                    {hasIngredients && (
                      <div className="match-badge">
                        {recipe.matchPercentage}%
                      </div>
                    )}
                  </div>
                  <div className="recipe-info">
                    <h3 className="recipe-name">{recipe.name}</h3>
                    <span className="recipe-category">{recipe.category}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Recipe Detail Modal */}
      <div className={`modal-overlay ${showDetail ? 'active' : ''}`} onClick={closeRecipeDetail}>
        <div className={`modal-content ${showDetail ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          {selectedRecipe && (
            <>
              <button className="close-btn" onClick={closeRecipeDetail}>×</button>
              
              <div className="modal-header">
                <img src={selectedRecipe.image} alt={selectedRecipe.name} className="modal-image" />
                <div className="modal-title-section">
                  <h2>{selectedRecipe.name}</h2>
                  <div className="modal-meta">
                    <span className="meta-badge">{selectedRecipe.category}</span>
                    <span className="meta-badge">{selectedRecipe.area}</span>
                    {hasIngredients && (
                      <span className="match-badge-large">{selectedRecipe.matchPercentage}% match</span>
                    )}
                  </div>
                </div>
              </div>

              {hasIngredients && selectedRecipe.matchedIngredients.length > 0 && (
                <div className="ingredient-section-modal matched">
                  <h4>✅ You Have</h4>
                  <div className="ingredient-list">
                    {selectedRecipe.matchedIngredients.map(ing => (
                      <span key={ing} className="ingredient-item matched">{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {hasIngredients && selectedRecipe.missingIngredients.length > 0 && (
                <div className="ingredient-section-modal missing">
                  <h4>🛒 Missing</h4>
                  <div className="ingredient-list">
                    {selectedRecipe.missingIngredients.map(ing => (
                      <span key={ing} className="ingredient-item missing">{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="ingredients-section">
                <h4>📝 All Ingredients</h4>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ing, index) => (
                    <li key={index} className="ingredient-list-item">
                      <span className="measure">{ing.measure}</span>
                      <span className={`name ${selectedRecipe.matchedIngredients.includes(ing.name) ? 'matched' : ''}`}>
                        {ing.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h4>👨‍🍳 Instructions</h4>
                <p className="instructions-text">{selectedRecipe.instructions}</p>
              </div>

              {selectedRecipe.youtubeUrl && (
                <a href={selectedRecipe.youtubeUrl} target="_blank" rel="noopener noreferrer" className="youtube-link">
                  📺 Watch on YouTube
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
