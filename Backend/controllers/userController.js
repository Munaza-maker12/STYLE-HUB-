const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const updateProfile = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.email) {
      const existing = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = req.body.email.toLowerCase();
    }

    const fields = ['name', 'address', 'city', 'postalCode', 'phone', 'note', 'country'];
    fields.forEach(f => {
      if (req.body[f]) user[f] = req.body[f];
    });

    if (req.file?.path) {
  // File upload — Cloudinary pe bhejo
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "stylehub/avatars",
  });
  user.avatar = result.secure_url;
} else if (req.body.avatarUrl && req.body.avatarUrl.startsWith("http")) {
  // Preset cartoon avatar URL — seedha save karo
  user.avatar = req.body.avatarUrl;
}

    if (req.body.measurements) {
      const measurements = typeof req.body.measurements === 'string'
        ? JSON.parse(req.body.measurements)
        : req.body.measurements;

      user.measurements = {
        ...user.measurements,
        ...measurements,
      };
    }

    const updated = await user.save();
    const { password, ...userSafe } = updated._doc;
    res.status(200).json({ message: 'Profile updated', user: userSafe });

  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getMeasurements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('measurements');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ measurements: user.measurements || {} });
  } catch (err) {
    console.error('getMeasurements error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const saveMeasurements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const measurements = req.body.measurements
      ? (typeof req.body.measurements === 'string'
        ? JSON.parse(req.body.measurements)
        : req.body.measurements)
      : null;

    if (!measurements) {
      return res.status(400).json({ message: 'Measurements required' });
    }

    user.measurements = measurements;
    await user.save();

    res.json({ message: 'Measurements saved', measurements: user.measurements });
  } catch (err) {
    console.error('saveMeasurements error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateProfile, getMeasurements, saveMeasurements };