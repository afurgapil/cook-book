const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ingredientSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  category: { type: String, required: true },
});
const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: [ingredientSchema],
  image: { type: String, required: true },
  difficulty: { type: String, required: true },
  time: { type: String, required: true },
  howKnow: { type: String },
  author: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
