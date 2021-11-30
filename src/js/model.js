import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  ingredientNum: 1,
  weekmeals: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    weekday: null,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    state.recipe = createRecipeObject(data);

    console.log(state.recipe.title.split(' ').join('+'));
    const nutrition = await AJAX(
      `https://api.spoonacular.com/recipes/guessNutrition?title=${state.recipe.title
        .split(' ')
        .join('+')}&apiKey=add202896f2942dda4803e35b9738bdd`
    );

    if (nutrition.calories) state.recipe.calories = nutrition.calories.value;

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe, '!!!!!!!!!!!!');
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / OldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

// const persistBookmarks = function () {
//   localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
// };

const persistData = function (data) {
  localStorage.setItem(data, JSON.stringify(state[data]));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  console.log(recipe);
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistData('bookmarks');
};

export const deleteBookmark = function (id) {
  deleteByIndex('bookmarks', id);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistData('bookmarks');
};

export const addWeekmeal = function (recipe, day) {
  if (state.weekmeals.some(el => el.id === recipe.id && el.weekday === day)) {
    alert("It seems you've already added this recipe on the same day");
    return;
  }

  state.recipe.weekday = day;
  const newRecipe = JSON.parse(JSON.stringify(recipe));
  state.weekmeals.push(newRecipe);

  persistData('weekmeals');
};

export const deleteWeekmeal = function (id) {
  deleteByIndex('weekmeals', id);

  persistData('weekmeals');
};

const deleteByIndex = function (data, id) {
  const index = state[data].findIndex(el => el.id === id);
  state[data].splice(index, 1);
};

const init = function (data) {
  const storage = localStorage.getItem(data);

  console.log(storage);

  if (storage) state[data] = JSON.parse(storage);
};

init('bookmarks');
init('weekmeals');

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const updateIngredients = function (ingredientNum) {
  this.state.ingredientNum = ingredientNum;
};

export const verifyQuantity = function () {};

export const uploadRecipe = async function (newRecipe, inps) {
  try {
    console.log(inps, inps[0].value, inps[1].value);

    const [ingredient, quantity] = inps;

    const ingredients = Array.from(ingredient)
      .map((ing, i) => {
        const quant = quantity[i].value;
        if (ing.value)
          return {
            quantity: quant ? parseInt(quant.trim()) : null,
            unit: quant.split(' ')[1] ? quant.split(' ')[1] : '',
            description: ing.value,
          };
      })
      .filter(ing => typeof ing === 'object' && ing !== null);

    console.log(ingredients);

    // const ingredients = Object.entries(newRecipe)
    //   .filter(entry => entry[0].startsWith('ingredient') && entry[1])
    //   .map(ing => {
    //     // const ingArr = ing[1].replaceAll(' ', '').split(',');
    //     const ingArr = ing[1].split(',').map(el => el.trim());

    //     if (ingArr.length !== 3)
    //       throw new Error(
    //         'Wrong ingredient format! Please use the correct format :)'
    //       );

    //     const [quantity, unit, description] = ingArr;
    //     return { quantity: quantity ? +quantity : null, unit, description };
    //   });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
