const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ingredientSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  isAvailable: { type: Boolean, required: true },
  category: { type: String, required: true },
});
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  favoriteFoods: [{ type: String }],
  isAdmin: { type: Boolean, default: false },
  ingredients: [ingredientSchema],
  token: { type: String, default: null },
  tokenEnd: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
