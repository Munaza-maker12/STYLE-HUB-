
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  slug: { type: String, required: true, unique: true },   
  image: { type: String }, 
  subcategories: [
    {
      name: { type: String, required: true }, 
      slug: { type: String, required: true }, 
      image: { type: String }
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);
