require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../models/User');
const getConnection = require('../utils/getConnection');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

const createAdmin = async () => {
  try {
    await getConnection();

    console.log("\n🔐 Admin Account Creation\n");

    const name = await ask("Enter name: ");
    const email = await ask("Enter email: ");
    const password = await ask("Enter password: ");

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("❌ User with this email already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log(`\n✅ Admin "${name}" created successfully!`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createAdmin();