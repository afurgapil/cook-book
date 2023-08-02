const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const menuSchema = new mongoose.Schema({
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 10 },
  itemImage: { type: String, required: true },
  comments: [commentSchema],
});

const placesSchema = new mongoose.Schema({
  author: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  placeName: { type: String, required: true },
  cleanliness: { type: Number, required: true, min: 1, max: 10 },
  staffAttitude: { type: Number, required: true, min: 1, max: 10 },
  comments: [commentSchema],
  menu: [menuSchema],
});

const Place = mongoose.model("Place", placesSchema);

module.exports = Place;
