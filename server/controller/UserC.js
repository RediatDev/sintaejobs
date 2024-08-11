const { Sequelize, Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { sequelize, User } = require("../models");
// initialize cors
dotenv.config();


//* Create user controller
const userC = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validation checks
  const errors = [];

  // Check if any field is empty
  if (!userName || !email || !password) {
    errors.push("All fields are required");
  }

  // If there are validation errors, respond with the errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if the userName is already taken
    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      return res.status(400).json({ errors: ["Username is already taken"] });
    }

    // Hash the password
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      userName,
      email,
      password: hashPassword,
    });

    // Generate a token
    let token = jwt.sign(
      { user_id: user.userId, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    // Respond with the token
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message:err.message});
  }
};


// * login controller
const loginC = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    errors.push("All fields are required");
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

let deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.destroy({
      where: { userId }  
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { userC, loginC, deleteUser };
