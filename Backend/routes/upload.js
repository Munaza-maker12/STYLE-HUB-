const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

// Multiple images upload
router.post("/images", upload.array("images", 5), (req, res) => {
  try {
    const urls = req.files.map(file => file.path); // Cloudinary URLs
    res.json({ message: "Images uploaded successfully!", urls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
});

module.exports = router;
