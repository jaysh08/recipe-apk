import { useState, useEffect } from 'react';
import './App.css';
import type { Recipe } from './types';
import { COMMON_INGREDIENTS } from './types';
import { fetchIndianRecipes, calculateMatchPercentage, sortRecipesByMatch } from './api';
import Splash from './Splash';

// Recipe type extended with match percentage
type RecipeWithMatch = Recipe & { 
  matchPercentage: number; 
  matchedIngredients: string[]; 
  missingIngredients: string[];
  isCustom?: boolean;
  isFavorite?: boolean;
};

// Confetti component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  const colors = ['#87CEEB', '#B5D8FF', '#FFD700', '#FF69B4', '#98FB98'];
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

// Floating bubbles
const FloatingBubbles = () => (
  <div className="bubbles-container">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="bubble"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
          width: `${10 + Math.random() * 30}px`,
          height: `${10 + Math.random() * 30}px`
        }}
      />
    ))}
  </div>
);

function App() {
  const [recipes, setRecipes] = useState<RecipeWithMatch[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithMatch | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customRecipes, setCustomRecipes] = useState<RecipeWithMatch[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  
  // Form state for custom recipe
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeImage, setNewRecipeImage] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
  const [newRecipeInstructions, setNewRecipeInstructions] = useState('');

  useEffect(() => {
    loadRecipes();
    // Load saved data
    const savedCustom = localStorage.getItem('customRecipes');
    const savedFavorites = localStorage.getItem('favorites');
    if (savedCustom) setCustomRecipes(JSON.parse(savedCustom));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    // Trigger entrance animation
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (recipes.length > 0 && selectedIngredients.length > 0) {
      updateRecipeMatches();
    }
  }, [selectedIngredients, recipes]);

  useEffect(() => {
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
  }, [customRecipes]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  async function loadRecipes() {
    setIsLoading(true);
    try {
      const data = await fetchIndianRecipes();
      const recipesWithMatch = data.map(recipe => ({
        ...recipe,
        matchPercentage: 0,
        matchedIngredients: [],
        missingIngredients: recipe.ingredients.map(i => i.name),
        isCustom: false,
        isFavorite: favorites.includes(recipe.id)
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

  function toggleFavorite(recipeId: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      if (!prev.includes(recipeId)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      return newFavorites;
    });
    // Update recipes
    setRecipes(prev => prev.map(r => ({ ...r, isFavorite: r.id === recipeId ? !r.isFavorite : r.isFavorite })));
  }

  function createCustomRecipe() {
    if (!newRecipeName.trim()) return;
    
    const ingredients = newRecipeIngredients.split('\n').filter(i => i.trim());
    const customRecipe: RecipeWithMatch = {
      id: `custom-${Date.now()}`,
      name: newRecipeName,
      image: newRecipeImage || 'https://via.placeholder.com/300x200?text=Custom+Recipe',
      category: 'Custom',
      area: 'My Kitchen',
      instructions: newRecipeInstructions,
      youtubeUrl: '',
      ingredients: ingredients.map(ing => {
        const [measure, ...nameParts] = ing.split(':');
        return { measure: measure?.trim() || '', name: nameParts.join(':').trim() || ing };
      }),
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: ingredients,
      isCustom: true,
      isFavorite: false
    };
    
    setCustomRecipes(prev => [...prev, customRecipe]);
    setShowCreateForm(false);
    setNewRecipeName('');
    setNewRecipeImage('');
    setNewRecipeIngredients('');
    setNewRecipeInstructions('');
    
    // Show confetti celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }

  function deleteCustomRecipe(recipeId: string) {
    setCustomRecipes(prev => prev.filter(r => r.id !== recipeId));
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
  
  const allRecipes = [...customRecipes, ...recipes];
  const displayRecipes = hasIngredients 
    ? allRecipes.filter(r => r.matchPercentage > 0 || r.isCustom)
    : allRecipes;
  
  const favoriteRecipes = allRecipes.filter(r => favorites.includes(r.id));

  // Update recipe matches for custom recipes
  useEffect(() => {
    if (customRecipes.length > 0) {
      setCustomRecipes(prev => prev.map(recipe => {
        const matchResult = calculateMatchPercentage(selectedIngredients, recipe.ingredients);
        return { ...recipe, ...matchResult };
      }));
    }
  }, [selectedIngredients]);

  return (
    <div className="app">
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
      <Confetti active={showConfetti} />
      <FloatingBubbles />
      
      {/* Header */}
      <header className={`header ${pageLoaded ? 'loaded' : ''}`}>
        <h1>🍲 Recipe Finder</h1>
        <p>Discover delicious Indian recipes with ingredients you have</p>
        
        {/* Tab Navigation */}
        <div className="tab-nav">
          <button 
            className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            🏠 Home
          </button>
          <button 
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            ❤️ Favorites ({favorites.length})
          </button>
        </div>
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

        {activeTab === 'home' && (
          <>
            {/* Add Custom Recipe Button */}
            <button className="add-recipe-btn" onClick={() => setShowCreateForm(true)}>
              ➕ Add Your Recipe
            </button>

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
                  <p>🍳 No recipes found? Let's get cooking!</p>
                  <small>Try adding more ingredients or create your own recipe</small>
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
                        <button 
                          className={`favorite-btn ${recipe.isFavorite ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(recipe.id, e)}
                        >
                          {recipe.isFavorite ? '❤️' : '🤍'}
                        </button>
                        {hasIngredients && (
                          <div className="match-badge">
                            {recipe.matchPercentage}%
                          </div>
                        )}
                        {recipe.isCustom && (
                          <span className="custom-badge">✨ Custom</span>
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
          </>
        )}

        {activeTab === 'favorites' && (
          <section className="recipes-section">
            <div className="section-header">
              <h2>❤️ Your Favorites</h2>
              <span className="match-count">{favoriteRecipes.length} recipes saved</span>
            </div>

            {favoriteRecipes.length === 0 ? (
              <div className="no-recipes">
                <p>💔 No favorites yet!</p>
                <small>Tap the heart on recipes you love</small>
              </div>
            ) : (
              <div className="recipe-grid">
                {favoriteRecipes.map((recipe, index) => (
                  <article
                    key={recipe.id}
                    className="recipe-card"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openRecipeDetail(recipe)}
                  >
                    <div className="recipe-image-wrapper">
                      <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                      <button 
                        className={`favorite-btn active`}
                        onClick={(e) => toggleFavorite(recipe.id, e)}
                      >
                        ❤️
                      </button>
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
        )}
      </main>

      {/* Custom Recipe Modal */}
      {showCreateForm && (
        <div className="modal-overlay active" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
            <div className="modal-title-section">
              <h2>✨ Create Your Recipe</h2>
            </div>
            
            <div className="create-form">
              <div className="form-group">
                <label>Recipe Name *</label>
                <input 
                  type="text" 
                  value={newRecipeName}
                  onChange={(e) => setNewRecipeName(e.target.value)}
                  placeholder="e.g., My Special Curry"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input 
                  type="text" 
                  value={newRecipeImage}
                  onChange={(e) => setNewRecipeImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Ingredients (one per line, format: amount : name)</label>
                <textarea 
                  value={newRecipeIngredients}
                  onChange={(e) => setNewRecipeIngredients(e.target.value)}
                  placeholder="1 cup : Rice
2 tbsp : Oil
1 tsp : Salt"
                  className="form-textarea"
                  rows={6}
                />
              </div>
              
              <div className="form-group">
                <label>Instructions</label>
                <textarea 
                  value={newRecipeInstructions}
                  onChange={(e) => setNewRecipeInstructions(e.target.value)}
                  placeholder="Step by step cooking instructions..."
                  className="form-textarea"
                  rows={5}
                />
              </div>
              
              <button className="create-btn" onClick={createCustomRecipe}>
                🎉 Create Recipe
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <button 
                      className={`favorite-meta-btn ${selectedRecipe.isFavorite ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                    >
                      {selectedRecipe.isFavorite ? '❤️ Favorite' : '🤍 Add to Favorites'}
                    </button>
                    {selectedRecipe.isCustom && (
                      <button 
                        className="delete-recipe-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomRecipe(selectedRecipe.id);
                          closeRecipeDetail();
                        }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {hasIngredients && selectedRecipe.matchedIngredients.length > 0 && (
                <div className="ingredient-section-modal matched">
                  <h4>✅ You Have</h4>
                  <div className="ingredient-list">
                    {selectedRecipe.matchedIngredients.map(ing => (
                      <span key={ing} className="ingredient-item matched">
                        <span className="check-icon">✓</span>
                        {ing}
                      </span>
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
                        {selectedRecipe.matchedIngredients.includes(ing.name) && <span className="check-icon">✓</span>}
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
