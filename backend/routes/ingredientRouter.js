const router = require("express").Router();
const Ingredients = require("../models/ingredients");
const User = require("../models/users");
// POST /api
router.post("/add", async (req, res) => {
  try {
    const { name, isAvailable, category } = req.body;

    const ingredient = new Ingredients({
      name,
      isAvailable,
      category,
    });

    await ingredient.save();

    res.status(201).json({ ingredient });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ingredient." });
  }
});

// GET /get
router.get("/get", async (req, res) => {
  try {
    const ingredients = await Ingredients.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});
//delete an ingredient
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredients.findByIdAndDelete(id);
    if (!ingredient) {
      return res
        .status(404)
        .json({ message: "Silinecek yemek tarifi bulunamadı." });
    }
    return res.status(200).json(true);
  } catch (error) {
    console.error(error, "Hata! ");
  }
});
//update an igredient
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  try {
    const ingredient = await Ingredients.findById(id);
    if (!ingredient) {
      return res.status(404).json({ error: "ingredient not found" });
    }

    ingredient.name = name;
    ingredient.category = category;
    await ingredient.save();

    return res.status(200).json({ message: "Updated ingredient succesfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating an ingredient" });
  }
});
router.put("/set/:id", async (req, res) => {
  try {
    const { id, updatedIngredients } = req.body;
    const userId = id;
    const user = await User.findByIdAndUpdate(userId, {
      ingredients: updatedIngredients,
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcı kaydı gerçekleştirilemedi." });
  }
});
module.exports = router;
