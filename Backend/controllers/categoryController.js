const Category = require("../models/Category");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");


exports.getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};

exports.getSubcategoriesByParent = async (req, res) => {
  try {
    const category = await Category.findById(req.params.parentId);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category.subcategories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subcategories", error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Duplicate check
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });
    if (existing)
      return res.status(400).json({ message: "Category with this name already exists" });

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });
      imageUrl = result.secure_url;
    }

    const category = new Category({
      name,
      slug: slugify(name, { lower: true }),
      image: imageUrl,
      subcategories: [],
      active: true,
    });

    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });
      updateData.image = result.secure_url;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err.message });
  }
};

exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.active = !category.active;
    await category.save();

    res.status(200).json({ message: "Category status updated", category });
  } catch (err) {
    res.status(500).json({ message: "Error toggling category status", error: err.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Duplicate check
    const isDuplicate = category.subcategories.some(
      (sub) => sub.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate)
      return res.status(400).json({ message: "Subcategory with this name already exists" });

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });
      imageUrl = result.secure_url;
    }

    category.subcategories.push({
      name,
      slug: slugify(name, { lower: true }),
      image: imageUrl,
    });

    await category.save();
    res.status(201).json({ message: "Subcategory added", category });
  } catch (err) {
    res.status(500).json({ message: "Error adding subcategory", error: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { subId } = req.params;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const sub = category.subcategories.id(subId);
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });

    if (name) {
      sub.name = name;
      sub.slug = slugify(name, { lower: true });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "categories" });
      sub.image = result.secure_url;
    }

    await category.save();
    res.status(200).json({ message: "Subcategory updated", category });
  } catch (err) {
    res.status(500).json({ message: "Error updating subcategory", error: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { subId } = req.params;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories = category.subcategories.filter(
      (sub) => sub._id.toString() !== subId
    );
    await category.save();

    res.status(200).json({ message: "Subcategory deleted", category });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subcategory", error: err.message });
  }
};

exports.getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalSubcategories = (await Category.find()).reduce(
      (acc, cat) => acc + cat.subcategories.length,
      0
    );
    res.status(200).json({ totalCategories, totalSubcategories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching category stats", error: err.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Error fetching category", error: err.message });
  }
};