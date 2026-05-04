// const express = require("express");
// const router = express.Router();
// const Review = require("../models/Review");
// const Product = require("../models/Product");
// const Order = require("../models/Order");
// const upload = require("../config/multer");
// const cloudinary = require("../config/cloudinary");

// // GET: Fetch all reviews for a product
// router.get("/product/:productId", async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { sort = "-createdAt", page = 1, limit = 10 } = req.query;

//     const reviews = await Review.find({ 
//       productId, 
//       status: "approved" 
//     })
//       .populate("userId", "name avatar")
//       .sort(sort)
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Review.countDocuments({ 
//       productId, 
//       status: "approved" 
//     });

//     res.json({
//       reviews,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET: Check if user can review (bought the product)
// router.get("/can-review/:productId/:userId", async (req, res) => {
//   try {
//     const { productId, userId } = req.params;

//     // Check if user has delivered order with this product
//     const orders = await Order.find({
//       userId,
//       status: "Delivered",
//       "items.productId": productId,
//     });

//     if (orders.length === 0) {
//       return res.json({ canReview: false, message: "You must purchase this product first" });
//     }

//     // Check if already reviewed
//     const existingReview = await Review.findOne({ productId, userId });
    
//     if (existingReview) {
//       return res.json({ 
//         canReview: false, 
//         message: "You have already reviewed this product",
//         existingReview 
//       });
//     }

//     res.json({ 
//       canReview: true, 
//       orderId: orders[0].orderId 
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// // ✅ NEW: Check if guest can review by Order ID + Email
// router.post("/can-review-guest", async (req, res) => {
//   try {
//     const { orderId, email, productId } = req.body;

//     // Check if order exists and is delivered
//     const order = await Order.findOne({
//       orderId,
//       "shipping.email": email,
//       status: "Delivered",
//       "items.productId": productId,
//     });

//     if (!order) {
//       return res.json({ 
//         canReview: false, 
//         message: "Order not found or not delivered yet" 
//       });
//     }

//     // Check if already reviewed
//     const existingReview = await Review.findOne({ 
//       orderId, 
//       productId,
//       guestEmail: email 
//     });

//     if (existingReview) {
//       return res.json({ 
//         canReview: false, 
//         message: "You have already reviewed this product",
//         existingReview 
//       });
//     }

//     res.json({ 
//       canReview: true, 
//       orderId: order.orderId 
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ UPDATE: Submit review (support guest)
// router.post("/", upload.array("images", 3), async (req, res) => {
//   try {
//     const { 
//       productId, 
//       userId, 
//       orderId, 
//       rating, 
//       title, 
//       comment,
//       guestEmail,
//       guestName 
//     } = req.body;

//     const isGuest = !userId;

//     if (!isGuest) {
//       // Registered user validation
//       const order = await Order.findOne({
//         orderId,
//         userId,
//         status: "Delivered",
//         "items.productId": productId,
//       });

//       if (!order) {
//         return res.status(403).json({ 
//           message: "You can only review purchased products" 
//         });
//       }

//       // Check duplicate
//       const existingReview = await Review.findOne({ 
//         productId, 
//         userId, 
//         orderId 
//       });
      
//       if (existingReview) {
//         return res.status(400).json({ 
//           message: "You have already reviewed this product" 
//         });
//       }
//     } else {
//       // ✅ Guest user validation
//       const order = await Order.findOne({
//         orderId,
//         "shipping.email": guestEmail,
//         status: "Delivered",
//         "items.productId": productId,
//       });

//       if (!order) {
//         return res.status(403).json({ 
//           message: "Invalid order or product not delivered yet" 
//         });
//       }

//       // Check duplicate guest review
//       const existingReview = await Review.findOne({ 
//         productId, 
//         orderId,
//         guestEmail 
//       });
      
//       if (existingReview) {
//         return res.status(400).json({ 
//           message: "You have already reviewed this product" 
//         });
//       }
//     }

//     // Upload images
//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map(file =>
//         cloudinary.uploader.upload(file.path, { 
//           folder: "stylehub/reviews" 
//         })
//       );
//       const results = await Promise.all(uploadPromises);
//       imageUrls = results.map(r => r.secure_url);
//     }

//     // Create review
//     const review = new Review({
//       productId,
//       userId: userId || null,
//       orderId,
//       rating: Number(rating),
//       title,
//       comment,
//       images: imageUrls,
//       verified: true, // Both registered & guest are verified buyers
//       status: "approved",
//       guestEmail: isGuest ? guestEmail : null,
//       guestName: isGuest ? guestName : null,
//     });

//     await review.save();

//     // Update product rating stats
//     const product = await Product.findById(productId);
//     await product.updateRatingStats();

//     res.status(201).json({ 
//       message: "Review submitted successfully!", 
//       review 
//     });
//   } catch (err) {
//     console.error("Review submission error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });
// // // POST: Submit a review
// // router.post("/", upload.array("images", 3), async (req, res) => {
// //   try {
// //     const { productId, userId, orderId, rating, title, comment } = req.body;

// //     // Validate user purchased product
// //     const order = await Order.findOne({
// //       orderId,
// //       userId,
// //       status: "Delivered",
// //       "items.productId": productId,
// //     });

// //     if (!order) {
// //       return res.status(403).json({ message: "You can only review purchased products" });
// //     }

// //     // Check for duplicate review
// //     const existingReview = await Review.findOne({ productId, userId, orderId });
// //     if (existingReview) {
// //       return res.status(400).json({ message: "You have already reviewed this product" });
// //     }

// //     // Upload images to Cloudinary
// //     let imageUrls = [];
// //     if (req.files && req.files.length > 0) {
// //       const uploadPromises = req.files.map(file =>
// //         cloudinary.uploader.upload(file.path, { 
// //           folder: "stylehub/reviews" 
// //         })
// //       );
// //       const results = await Promise.all(uploadPromises);
// //       imageUrls = results.map(r => r.secure_url);
// //     }

// //     // Create review
// //     const review = new Review({
// //       productId,
// //       userId,
// //       orderId,
// //       rating: Number(rating),
// //       title,
// //       comment,
// //       images: imageUrls,
// //       verified: true,
// //       status: "approved",
// //     });

// //     await review.save();

// //     // Update product rating stats
// //     const product = await Product.findById(productId);
// //     await product.updateRatingStats();

// //     res.status(201).json({ 
// //       message: "Review submitted successfully", 
// //       review 
// //     });
// //   } catch (err) {
// //     console.error("Review submission error:", err);
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // PUT: Update review
// router.put("/:reviewId", upload.array("images", 3), async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const { rating, title, comment, existingImages } = req.body;

//     const review = await Review.findById(reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Upload new images
//     let newImages = [];
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map(file =>
//         cloudinary.uploader.upload(file.path, { 
//           folder: "stylehub/reviews" 
//         })
//       );
//       const results = await Promise.all(uploadPromises);
//       newImages = results.map(r => r.secure_url);
//     }

//     // Combine existing and new images
//     let oldImages = [];
//     if (existingImages) {
//       oldImages = JSON.parse(existingImages);
//     }

//     review.rating = rating || review.rating;
//     review.title = title || review.title;
//     review.comment = comment || review.comment;
//     review.images = [...oldImages, ...newImages];

//     await review.save();

//     // Update product stats
//     const product = await Product.findById(review.productId);
//     await product.updateRatingStats();

//     res.json({ message: "Review updated successfully", review });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE: Delete review
// router.delete("/:reviewId", async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const review = await Review.findByIdAndDelete(reviewId);

//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Update product stats
//     const product = await Product.findById(review.productId);
//     await product.updateRatingStats();

//     res.json({ message: "Review deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST: Mark review as helpful
// router.post("/:reviewId/helpful", async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const review = await Review.findByIdAndUpdate(
//       reviewId,
//       { $inc: { helpful: 1 } },
//       { new: true }
//     );

//     res.json({ helpful: review.helpful });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// ✅ Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"), false);
    }
  }
});

// ✅ 1. Check if logged-in user can review
router.get("/can-review/:productId/:userId", async (req, res) => {
  try {
    const { productId, userId } = req.params;

    // Check if already reviewed
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.json({ canReview: false, message: "Already reviewed" });
    }

    // Check if user purchased this product
    const order = await Order.findOne({
      userId,
      "items.productId": productId,
      status: { $in: ["Delivered", "Completed"] }
    });

    if (!order) {
      return res.json({ canReview: false, message: "Purchase this product first" });
    }

    res.json({ canReview: true, orderId: order.orderId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ 2. Check if guest can review
router.post("/can-review-guest", async (req, res) => {
  try {
    const { orderId, email, productId } = req.body;

    if (!orderId || !email || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find order with matching orderId and email
    const order = await Order.findOne({
      orderId,
      "shipping.email": email,
      "items.productId": productId,
      status: { $in: ["Delivered", "Completed", "Pending"] } // Allow reviews even for Pending
    });

    if (!order) {
      return res.json({ 
        canReview: false, 
        message: "Order not found or product not in this order" 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      productId,
      orderId,
      guestEmail: email
    });

    if (existingReview) {
      return res.json({ canReview: false, message: "You already reviewed this product" });
    }

    res.json({ canReview: true, orderId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ 3. Submit review (both logged-in and guest)
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { productId, userId, orderId, rating, title, comment, guestEmail, guestName } = req.body;

    // Validation
    if (!productId || !orderId || !rating || !title || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if guest or user
    const isGuest = !userId;

    if (isGuest && (!guestEmail || !guestName)) {
      return res.status(400).json({ message: "Guest name and email required" });
    }

    // Verify order exists
    const orderQuery = isGuest
      ? { orderId, "shipping.email": guestEmail, "items.productId": productId }
      : { orderId, userId, "items.productId": productId };

    const order = await Order.findOne(orderQuery);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check for duplicate review
    const duplicateQuery = isGuest
      ? { productId, orderId, guestEmail }
      : { productId, userId };

    const existingReview = await Review.findOne(duplicateQuery);
    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "review_images"
        });
        imageUrls.push(result.secure_url);
      }
    }

    // Create review
    const review = new Review({
      productId,
      userId: userId || null,
      orderId,
      guestEmail: guestEmail || null,
      guestName: guestName || null,
      rating: Number(rating),
      title,
      comment,
      images: imageUrls,
      verified: true
    });

    await review.save();

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("Review submission error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ 4. Get reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = "-createdAt", page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ productId })
      .populate("userId", "name avatar")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ productId });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ 5. Mark review as helpful
router.post("/:id/helpful", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.find({ productId, status: "approved" });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
    return;
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    ratingDistribution[r.rating]++;
  });

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating),
    totalReviews: reviews.length,
    ratingDistribution
  });
}

module.exports = router;