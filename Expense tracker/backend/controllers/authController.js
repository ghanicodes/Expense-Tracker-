const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uploadToCloudinary = require("./imageController")

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};


// REGISTER USER
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let imageUrl = null;

    if (req.file) {

    const result = await uploadToCloudinary(req.file.buffer);

      imageUrl = result.secure_url;
    }

    // PASSWORD HASH
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl: imageUrl,
    });

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: "Error Registration User",
      error: error.message,
    });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
      const token = generateToken(user._id);

    res.cookie("token", token);

     
    res.status(200).json({
       message: "Login successful",
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      message: "Login Error",
      error: error.message,
    });
  }
};

// GET USER 
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: "Error Fetching User",
      error: error.message,
    });
  }
};


// Logout User 

  exports.logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), 
    });

    res.status(200).json({
      message: "Logout Successfully",
    });

  } catch (error) {
    console.log("User Logout Error :", error.message);

    res.status(500).json({
      message: "User Logout Error",
      error: error.message,
    });
  }
}
  