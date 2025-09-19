const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user-model");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

// 🔹 Register (Hash password before saving)
router.post("/register", async (req, res) => {
  try {
    const { name, branch, age, role, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      branch,
      age,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Login (Verify password)
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await UserModel.findOne({ name });
    if (!user) return res.status(404).json({ error: "User not found" });

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Protected Route (Only admin can access)
router.get("/all-users", authMiddleware(["admin"]), async (req, res) => {
  const users = await UserModel.find().select("-password"); // hide password
  res.json(users);
});

// 🔹 Get My Profile (Any logged-in user)
router.get("/profile", authMiddleware(), async (req, res) => {
  const user = await UserModel.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
