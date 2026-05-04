// // const express = require("express");
// // const router = express.Router();
// // const Product = require("../models/Product");

// // // Add Product
// // router.post("/add", async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       category,
// //       subCategory,
// //       images,
// //       new_price,
// //       old_price,
// //       available,
// //       description,
// //       stock,
// //       customStock,
// //     } = req.body;

// //     const newProduct = new Product({
// //       name,
// //       category,
// //       subCategory,
// //       images,
// //       new_price,
// //       old_price,
// //       available,
// //       description,
// //       stock,
// //       customStock,
// //     });

// //     await newProduct.save();
// //     res.status(201).json({ message: "Product added successfully", product: newProduct });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to add product", details: err.message });
// //   }
// // });

// // // Get All Products
// // router.get("/", async (req, res) => {
// //   try {
// //     const products = await Product.find();
// //     res.json(products);
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to fetch products" });
// //   }
// // });

// // // Get Products by Category Name
// // router.get("/category/:categoryName", async (req, res) => {
// //   try {
// //     const { categoryName } = req.params;
// //     const products = await Product.find({ category: categoryName });
// //     res.json(products);
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to fetch products by category" });
// //   }
// // });

// // // Update Product
// // router.put("/update/:id", async (req, res) => {
// //   try {
// //     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json({ message: "Product updated", product: updated });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to update product" });
// //   }
// // });

// // // Delete Product
// // router.delete("/delete/:id", async (req, res) => {
// //   try {
// //     await Product.findByIdAndDelete(req.params.id);
// //     res.json({ message: "Product deleted" });
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to delete product" });
// //   }
// // });

// // // Get latest 16 products (New Arrivals)
// // router.get("/newarrivals", async (req, res) => {
// //   try {
// //     const products = await Product.find().sort({ dateAdded: -1 }).limit(16);
// //     res.json({ success: true, products });
// //   } catch (err) {
// //     console.error("NewArrivals Error:", err.message);
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // });

// // // Search
// // router.get("/search/query", async (req, res) => {
// //   try {
// //     const { q } = req.query;
// //     if (!q || q.trim() === '') return res.json([]);

// //     const products = await Product.find({
// //       $or: [
// //         { name: { $regex: q, $options: 'i' } },
// //         { color: { $elemMatch: { $regex: q, $options: 'i' } } },
// //         { category: { $regex: q, $options: 'i' } },
// //         { subCategory: { $regex: q, $options: 'i' } },
// //         { description: { $elemMatch: { $regex: q, $options: 'i' } } }
// //       ]
// //     }).limit(10);

// //     res.json(products);
// //   } catch (err) {
// //     res.status(500).json({ error: "Search failed", details: err.message });
// //   }
// // });

// // // ✅ Custom stock reset — MUST be before /:productId/stock/:size
// // router.delete("/:productId/stock/custom", async (req, res) => {
// //   try {
// //     const { productId } = req.params;

// //     const result = await Product.findByIdAndUpdate(
// //       productId,
// //       { $set: { customStock: 0 } },
// //       { new: true }
// //     );

// //     if (!result) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     res.json({ success: true, message: "Custom stock reset to 0", product: result });
// //   } catch (error) {
// //     console.error("Error resetting custom stock:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });

// // // Size permanently delete karo
// // router.delete("/:productId/stock/:size", async (req, res) => {
// //   try {
// //     const { productId, size } = req.params;

// //     const validSizes = ["S", "M", "L", "XL", "XXL"];
// //     if (!validSizes.includes(size)) {
// //       return res.status(400).json({ message: "Invalid size" });
// //     }

// //     const result = await Product.findByIdAndUpdate(
// //       productId,
// //       { $unset: { [`stock.${size}`]: "" } },
// //       { new: true }
// //     );

// //     if (!result) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     res.json({ success: true, message: `Size ${size} deleted`, product: result });

// //   } catch (error) {
// //     console.error("Error deleting size:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });

// // // Get single product by ID — LAST MEIN RAKHNA
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
// //     if (!product) return res.status(404).json({ message: "Product not found" });
// //     res.json(product);
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to fetch product", details: err.message });
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");

// // Add Product
// router.post("/add", async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       subCategory,
//       images,
//       new_price,
//       old_price,
//       available,
//       description,
//       stock,
//       customStock,
//     } = req.body;

//     const newProduct = new Product({
//       name,
//       category,
//       subCategory,
//       images,
//       new_price,
//       old_price,
//       available,
//       description,
//       stock,
//       customStock,
//     });

//     await newProduct.save();
//     res.status(201).json({ message: "Product added successfully", product: newProduct });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to add product", details: err.message });
//   }
// });

// // Get All Products
// router.get("/", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// // Get Products by Category Name
// router.get("/category/:categoryName", async (req, res) => {
//   try {
//     const { categoryName } = req.params;
//     const products = await Product.find({ category: categoryName });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch products by category" });
//   }
// });

// // Update Product
// router.put("/update/:id", async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ message: "Product updated", product: updated });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// // Delete Product
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });

// // Get latest 16 products (New Arrivals)
// router.get("/newarrivals", async (req, res) => {
//   try {
//     const products = await Product.find().sort({ dateAdded: -1 }).limit(16);
//     res.json({ success: true, products });
//   } catch (err) {
//     console.error("NewArrivals Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // Search
// router.get("/search/query", async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q || q.trim() === '') return res.json([]);

//     const products = await Product.find({
//       $or: [
//         { name: { $regex: q, $options: 'i' } },
//         { color: { $elemMatch: { $regex: q, $options: 'i' } } },
//         { category: { $regex: q, $options: 'i' } },
//         { subCategory: { $regex: q, $options: 'i' } },
//         { description: { $elemMatch: { $regex: q, $options: 'i' } } }
//       ]
//     }).limit(10);

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: "Search failed", details: err.message });
//   }
// });

// // // ✅ Custom stock permanently delete — MUST be before /:productId/stock/:size
// // router.delete("/:productId/stock/custom", async (req, res) => {
// //   try {
// //     const { productId } = req.params;

// //     const result = await Product.findByIdAndUpdate(
// //       productId,
// //       { $unset: { customStock: "" } },
// //       { new: true }
// //     );

// //     if (!result) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }

// //     res.json({ success: true, message: "Custom stock deleted", product: result });
// //   } catch (error) {
// //     console.error("Error deleting custom stock:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });
// router.delete("/:productId/stock/custom", async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const result = await Product.findByIdAndUpdate(
//       productId,
//       { $set: { customStock: null } },
//       { new: true }
//     );

//     if (!result) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ success: true, message: "Custom stock deleted", product: result });
//   } catch (error) {
//     console.error("Error deleting custom stock:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
// // Naya size add karo stock mein
// router.post("/:productId/stock/:size", async (req, res) => {
//   try {
//     const { productId, size } = req.params;
//     const { quantity } = req.body;

//     const validSizes = ["S", "M", "L", "XL", "XXL"];
//     if (!validSizes.includes(size)) {
//       return res.status(400).json({ message: "Invalid size" });
//     }

//     // Check karo size pehle se exist to nahi karta
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     if (product.stock && product.stock[size] !== undefined) {
//       return res.status(400).json({ message: `Size ${size} already exists` });
//     }

//     const result = await Product.findByIdAndUpdate(
//       productId,
//       { $set: { [`stock.${size}`]: Number(quantity) || 0 } },
//       { new: true }
//     );

//     res.json({ success: true, message: `Size ${size} added`, product: result });
//   } catch (error) {
//     console.error("Error adding size:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
// // Size permanently delete karo
// router.delete("/:productId/stock/:size", async (req, res) => {
//   try {
//     const { productId, size } = req.params;

//     const validSizes = ["S", "M", "L", "XL", "XXL"];
//     if (!validSizes.includes(size)) {
//       return res.status(400).json({ message: "Invalid size" });
//     }

//     const result = await Product.findByIdAndUpdate(
//       productId,
//       { $unset: { [`stock.${size}`]: "" } },
//       { new: true }
//     );

//     if (!result) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json({ success: true, message: `Size ${size} deleted`, product: result });

//   } catch (error) {
//     console.error("Error deleting size:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // Get single product by ID — LAST MEIN RAKHNA
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch product", details: err.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/add", async (req, res) => {
  try {
    const { name, category, subCategory, images, new_price, old_price, available, description, stock, customStock } = req.body;
    const newProduct = new Product({ name, category, subCategory, images, new_price, old_price, available, description, stock, customStock });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/category/:categoryName", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

router.get("/newarrivals", async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 }).limit(16);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/search/query", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return res.json([]);
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { color: { $elemMatch: { $regex: q, $options: 'i' } } },
        { category: { $regex: q, $options: 'i' } },
        { subCategory: { $regex: q, $options: 'i' } },
        { description: { $elemMatch: { $regex: q, $options: 'i' } } }
      ]
    }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Search failed", details: err.message });
  }
});

// ✅ New SIZE ADD — MUST be before /:productId/stock/:size DELETE
router.post("/:productId/stock/:size", async (req, res) => {
  try {
    const { productId, size } = req.params;
    const { quantity } = req.body;
    const validSizes = ["S", "M", "L", "XL", "XXL"];
    if (!validSizes.includes(size)) return res.status(400).json({ message: "Invalid size" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock && product.stock[size] !== undefined)
      return res.status(400).json({ message: `Size ${size} already exists` });

    const result = await Product.findByIdAndUpdate(
      productId,
      { $set: { [`stock.${size}`]: Number(quantity) || 0 } },
      { new: true }
    );
    res.json({ success: true, message: `Size ${size} added`, product: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ CUSTOM STOCK DELETE — MUST be before /:productId/stock/:size
router.delete("/:productId/stock/custom", async (req, res) => {
  try {
    const result = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { customStock: null } },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Custom stock deleted", product: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// SIZE DELETE
router.delete("/:productId/stock/:size", async (req, res) => {
  try {
    const { productId, size } = req.params;
    const validSizes = ["S", "M", "L", "XL", "XXL"];
    if (!validSizes.includes(size)) return res.status(400).json({ message: "Invalid size" });

    const result = await Product.findByIdAndUpdate(
      productId,
      { $unset: { [`stock.${size}`]: "" } },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: `Size ${size} deleted`, product: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET SINGLE — LAST MEIN RAKHNA
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product", details: err.message });
  }
});

module.exports = router;
