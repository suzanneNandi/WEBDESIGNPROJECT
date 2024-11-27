// Load recipes from JSON and localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  fetch('recipes.json')
      .then(response => response.json())
      .then(data => {
          // Store initial recipes in localStorage if not already set
          if (!localStorage.getItem('recipes')) {
              localStorage.setItem('recipes', JSON.stringify(data.categories));
          }
          displayRecipes();
      })
      .catch(error => console.error('Error loading recipes:', error));
});

// Function to get all recipes from localStorage
function getRecipes() {
  return JSON.parse(localStorage.getItem('recipes')) || [];
}

// Function to display all recipes grouped by categories
function displayRecipes() {
  const recipeContainer = document.getElementById('recipeContainer');
  const categories = getRecipes();
  recipeContainer.innerHTML = '';

  categories.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');
      categoryDiv.innerHTML = `<h2>${category.name}</h2>`;

      category.recipes.forEach(recipe => {
          const recipeCard = `
              <div class="recipe-card">
                  <img src="${recipe.image}" alt="${recipe.name}">
                  <h3>${recipe.name}</h3>
                  <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                  <p><strong>Instructions:</strong> ${recipe.instructions}</p>
              </div>
          `;
          categoryDiv.innerHTML += recipeCard;
      });

      recipeContainer.appendChild(categoryDiv);
  });
}

// Handle recipe form submissions
const form = document.getElementById('recipeForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Gather form data
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const ingredients = document.getElementById('ingredients').value.split(',');
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').value || 'default.jpg';

  const newRecipe = { name, ingredients, instructions, image };

  // Get all recipes from localStorage
  const categories = getRecipes();

  // Add the new recipe to the selected category
  const categoryIndex = categories.findIndex(cat => cat.name === category);
  if (categoryIndex >= 0) {
      categories[categoryIndex].recipes.push(newRecipe);
  }

  // Save updated categories back to localStorage
  localStorage.setItem('recipes', JSON.stringify(categories));

  // Reset form and update UI
  form.reset();
  displayRecipes();
  alert('Recipe added successfully!');
});
