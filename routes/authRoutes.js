const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//-------- Signup routes --------

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ error: "User Already Exists!!" });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error during registration", details: error.message });
  }
});

//-------- Login routes --------

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email and password!!" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email and password!!" });

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.status(200).json({message: 'Login Successful', token});

  } catch (error) {
    res.status(500).json({error: 'Error during login', details: error.message})
  }
});

module.exports = router;
