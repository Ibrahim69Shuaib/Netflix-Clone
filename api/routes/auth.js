const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email on the server side
  if (!validator.isEmail(email)) {
    return res.status(400).json("Invalid email address");
  }

  try {
    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json("Email already exists");
      } else if (existingUser.username === username) {
        return res.status(400).json("Username already exists");
      }
    }

    // Encrypt the password
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate email on the server side
  if (!validator.isEmail(email)) {
    return res.status(400).json("Invalid email address");
  }

  try {
    // Search for a user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      // If the user is not found, return a 401 Unauthorized response
      return res.status(401).json("Wrong password or username!");
    }

    // Decrypt the stored password
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== password) {
      // If the password is incorrect, return a 401 Unauthorized response
      return res.status(401).json("Wrong password or username!");
    }

    // If authentication is successful, generate a JWT token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    const { password: _, ...info } = user._doc;

    // Return the user info and access token
    res.status(200).json({ ...info, accessToken });
  } catch (err) {
    // Handle other errors with a 500 Internal Server Error response
    res.status(500).json(err.message);
  }
});

module.exports = router;
