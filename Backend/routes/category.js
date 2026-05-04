const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");

const {
  getMainCategories,
  getSubcategoriesByParent,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategoryBySlug 
} = require("../controllers/categoryController");


router.get("/", getMainCategories);
router.get("/parent/:parentId", getSubcategoriesByParent);

router.post("/", verifyTokenAndAdmin, upload.single("image"), createCategory);
router.put("/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);


router.post("/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
router.put("/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
router.delete("/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
router.get("/:slug", getCategoryBySlug);

module.exports = router;
