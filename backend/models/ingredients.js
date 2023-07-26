const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, default: false },
  category: { type: String, required: true },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema); // Model oluşturma

module.exports = Ingredient;
