const router = require("express").Router();
const Recipe = require("../models/recipes");
const bodyParser = require("body-parser");

//add recipe
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      category,
      image,
      difficulty,
      time,
      howKnow,
      author,
      ingredients: recipeIngredients,
    } = req.body;

    const recipe = new Recipe({
      name,
      category,
      image,
      difficulty,
      time,
      howKnow,
      author,
      ingredients: recipeIngredients,
    });

    await recipe.save();

    res.status(201).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe." });
  }
});
//get all recipes
router.get("/get", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});
// Get a  recipe
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Error getting recipe" });
  }
});

// Add like to a recipe
router.put("/like/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId }, $pull: { dislikes: userId } },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error adding like to Recipe:", error);
    res.status(500).json({ error: "Error adding like to Recipe" });
  }
});

// Add dislike to a recipe
router.put("/dislike/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { $addToSet: { dislikes: userId }, $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    console.error("Error adding dislike to Recipe:", error);
    res.status(500).json({ error: "Error adding dislike to Recipe" });
  }
});

// Add to favorites a recipe
router.put("/favorite/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const { userId } = req.body;
  try {
    const newFav = await Recipe.findById(recipeId);

    await User.findByIdAndUpdate(userId, {
      $push: { favoriteFoods: newFav._id },
    });

    await Recipe.findByIdAndUpdate(recipeId, {
      $push: { favorites: userId },
    });

    res.status(200).json({ message: "Article added to favorites." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

// Remove from favorites a recipe
router.delete("/unfavorite/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const { userId } = req.body;

  try {
    const newUnFav = await Recipe.findById(recipeId);

    await User.findByIdAndUpdate(userId, {
      $pull: { favoriteFoods: newUnFav._id },
    });

    await Recipe.findByIdAndUpdate(recipeId, {
      $pull: { favorites: userId },
    });

    res.status(200).json({ message: "Article removed from favorites." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

// List a user's favorites
router.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.favoriteFoods);
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});
//delete a recipe
router.delete("/delete", async (req, res) => {
  const { recipeId } = req.body;
  try {
    console.log(recipeId);
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "Silinecek yemek tarifi bulunamadı." });
    }

    return res.status(200).json({ message: "Yemek tarifi başarıyla silindi." });
  } catch (error) {
    console.error("Silme işlemi sırasında bir hata oluştu:", error);
    return res
      .status(500)
      .json({ message: "Yemek tarifini silerken bir hata oluştu." });
  }
});
//update a recipes howknow
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { howKnow } = req.body;
  try {
    const updatedRecipe = await Recipe.findById(id);
    updatedRecipe.howKnow = howKnow;
    await updatedRecipe.save();
    res.status(200).json(updatedRecipe); // Sending back the updated recipe as a response
  } catch (error) {
    console.log("An error updating a howKnow ", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the recipe." });
  }
});

module.exports = router;
