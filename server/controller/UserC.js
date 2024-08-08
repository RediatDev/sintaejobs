
const { Sequelize, Model, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
// initialize cors 
dotenv.config()

const { sequelize, User } = require('../models');

//* Create user controller
const userC = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validation checks
  const errors = [];

  // Check if any field is empty
  if (!userName || !email || !password) {
    errors.push('All fields are required');
  }


  // If there are validation errors, respond with the errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
 let salt = await bcrypt.genSalt(10);
 let hashPassword = await bcrypt.hash(password,salt)


  // If validation passes, create the user
  User.create({
    userName,
    email,
    password :hashPassword,
  })
  .then((user) => {
     let token = jwt.sign({user_id:user.userId,email:user.email,role:user.role},process.env.SECRET_KEY,{expiresIn :"3d"})
    res.end(token);
  })
  .catch((err) => {
    console.log(err.message);
    res.status(500).end(err.message);
  });
};


// * login controller 
const loginC = async (req,res)=>{
  const { email, password } = req.body;
  if (!email || !password) {
    errors.push('All fields are required');
  }
  
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "3d" });

    res.json({ message: 'Login successful', token });
} catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
}
  
  






}
module.exports ={userC,loginC}