require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const getConnection = require('./utils/getConnection');
const productRoutes = require('./routes/product');
const categoryRoutes = require("./routes/category");
const userRoutes = require('./routes/user');
const uploadRoutes = require("./routes/upload");
const orderRoute = require("./routes/order");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notifications");
const reviewRoutes = require("./routes/reviews");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", require("./routes/product"));
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/user', userRoutes);

// Static folder for images
app.use('/images', express.static('upload/images'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Multer setup
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// Image upload route
app.post('/upload', upload.array('images', 5), (req, res) => {
  const urls = req.files.map(file => `http://localhost:${process.env.PORT}/images/${file.filename}`);
  res.json({ success: true, urls });
});

// Error handler
app.use((error, req, res, next) => {
  const message = error.message || 'Internal Server Error';
  const status = error.status || 500;
  res.status(status).json({ message });
});

console.log('JWT Secret exists:', !!process.env.ACCESS_TOKEN_KEY);

// Connect DB and start server
getConnection();
app.listen(process.env.PORT, () => console.log('Server is running on port ' + process.env.PORT));