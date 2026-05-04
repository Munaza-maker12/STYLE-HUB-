
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   slug: { type: String, unique: true },
//   category: { type: String, required: true }, 
//   subCategory: { type: String, required: true }, 
//     color: { type: String, default: '' },
    
//   images: [{ type: String, required: true }],
//   new_price: { type: Number, required: true },
//   old_price: { type: Number },

//   available: { type: Boolean, default: true },
//   description: { type: [String] },

//   stock: {
//     S: { type: Number, default: 0 },
//     M: { type: Number, default: 0 },
//     L: { type: Number, default: 0 },
//     XL: { type: Number, default: 0 },
//     XXL: { type: Number, default: 0 }
//   },

//   customStock: { type: Number, default: 10 },
//   dateAdded: { type: Date, default: Date.now },

//  averageRating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5,
//   },
//    totalReviews: {
//     type: Number,
//     default: 0,
//   },
//   ratingDistribution: {
//     5: { type: Number, default: 0 },
//     4: { type: Number, default: 0 },
//     3: { type: Number, default: 0 },
//     2: { type: Number, default: 0 },
//     1: { type: Number, default: 0 },
//   },

  
// });
// productSchema.methods.updateRatingStats = async function() {
//   const Review = require('./Review');
  
//   const reviews = await Review.find({ 
//     productId: this._id, 
//     status: 'approved' 
//   });
//   this.totalReviews = reviews.length;
  
//   if (reviews.length === 0) {
//     this.averageRating = 0;
//     this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//   } else {
//     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
//     this.averageRating = (sum / reviews.length).toFixed(1);
    
//     // Calculate distribution
//     this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     reviews.forEach(review => {
//       this.ratingDistribution[review.rating]++;
//     });
//   }
  
//   await this.save();
// };

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  color: { type: String, default: '' },

  images: [{ type: String, required: true }],
  new_price: { type: Number, required: true },
  old_price: { type: Number },

  available: { type: Boolean, default: true },
  description: { type: [String] },

  
  stock: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  customStock: { type: Number, default: null },
  dateAdded: { type: Date, default: Date.now },

  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 },
  },
});

productSchema.methods.updateRatingStats = async function () {
  const Review = require('./Review');

  const reviews = await Review.find({
    productId: this._id,
    status: 'approved'
  });
  this.totalReviews = reviews.length;

  if (reviews.length === 0) {
    this.averageRating = 0;
    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  } else {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / reviews.length).toFixed(1);

    this.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      this.ratingDistribution[review.rating]++;
    });
  }

  await this.save();
};

module.exports = mongoose.model("Product", productSchema);
