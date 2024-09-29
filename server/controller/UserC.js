const { Sequelize, Model, DataTypes, where } = require("sequelize");
const bcrypt = require("bcrypt");
const crypto = require('crypto'); 
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const { sequelize, User,RefreshToken } = require("../models");
const {axiosInstance} = require('../utility/axiosInstance.js')
// initialize cors
dotenv.config();
//* Create user controller
const userC = async (req, res) => {
  const { userName, email, password, sq1, sqa1 } = req.body;

  // Validation checks
  const errors = [];
  if (!userName || !email || !password || !sq1 || !sqa1) {
    errors.push("All fields are required");
  }

  // If there are validation errors, respond with the errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if the userName is already taken
    const existingUser = await User.findOne({ where: { userName } });
    const existingGmail = await User.findOne({ where: { email } });
    if (existingUser || existingGmail) {
      return res.status(400).json({ errors: "User name or email already in use"});
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const encryptionKey = crypto.randomBytes(32); 
    const iv = crypto.randomBytes(16); 
    const hashPassword = await bcrypt.hash(password, salt);
    
    // Generate JWT
    const tokenPayload = { userName, email, hashPassword, sq1, sqa1 };
    const accessToken = jwt.sign(tokenPayload, process.env.SIGN_UP_SECRET, { expiresIn: '1d' });

    // Encrypt the JWT
    const algorithm = 'aes-256-ctr';
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encryptedJWT = cipher.update(accessToken, 'utf8', 'hex');
    encryptedJWT += cipher.final('hex');

    // Encode components for the verification link
    const base64EncodedJWT = encodeURIComponent(Buffer.from(encryptedJWT).toString('base64'));
    const base64EncodedKey = encodeURIComponent(Buffer.from(encryptionKey).toString('base64'));
    const base64EncodedIV = encodeURIComponent(Buffer.from(iv).toString('base64'));

    // Create verification link
    const baseURL = axiosInstance.defaults.baseURL;
    const verificationLink = `${baseURL}/users/verify/${base64EncodedJWT}/${base64EncodedKey}/${base64EncodedIV}`;

    // Send verification email
    const mailSender = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const details = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ACCOUNT VERIFICATION !',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border: 1px solid #cccccc;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  text-align: center;
                  padding: 20px;
              }
              .cta-button {
                  display: inline-block;
                  padding: 15px 25px;
                  margin: 20px 0;
                  background-color: #FF8500;
                  color: #ffffff;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  text-align: center;
                  padding: 10px 0;
                  font-size: 12px;
                  color: #777777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <svg width="100" height="100" xmlns="../assets/images/aspire2.png">
                      <rect width="100" height="100" fill="#007BFF"/>
                  </svg>
                  <h1>ASPIRE</h1>
              </div>
              <div class="content">
                  <h1>Account Verification</h1>
                  <p>Click the button below to verify your account.</p>
                  <a href="${verificationLink}" class="cta-button">Verify My Account</a>
          </div>
          <div class="footer">
              <p>Link will expire in <b>1 day</b><p>
              <br>
              <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
      </div>
      </body>
      </html>
    `,
    };

     mailSender.sendMail(details, (err, info) => {
      if (err) {
        console.log('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Verification email sent! Please check your email check your inbox/spam folder in your email' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

//* verifyingEmail
const verifyEmail = async (req, res) => {
  const { encryptedJWT, encryptionKey, iv } = req.params;

  try {
    // Decode and decrypt values
    const decodedJWT = Buffer.from(decodeURIComponent(encryptedJWT), 'base64').toString('utf-8');
    const decodedKey = Buffer.from(decodeURIComponent(encryptionKey), 'base64');
    const decodedIV = Buffer.from(decodeURIComponent(iv), 'base64');

    const decryptJWT = (encryptedJWT, encryptionKey, iv) => {
      const decipher = crypto.createDecipheriv('aes-256-ctr', decodedKey, decodedIV);
      let decrypted = decipher.update(encryptedJWT, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    };

    // Decrypt the JWT
    const decryptedJWT = decryptJWT(decodedJWT, decodedKey, decodedIV);

    // Verify the JWT
    jwt.verify(decryptedJWT, process.env.SIGN_UP_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(400).json({ message: "Verification time span expired. Please request a new verification link." });
        }
        return res.status(400).json({ message: "Invalid verification." });
      }

      // Create the user
      const { userName, email, hashPassword, sq1, sqa1 } = decoded;

      const newUser = await User.create({
        userName,
        email,
        password: hashPassword,
        sq1,
        sqa1,
      });

      const accessToken = jwt.sign(
        { user_id: newUser.userId, email: newUser.email, role: newUser.role },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
      );

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.status(201).json({ message: 'User created successfully' });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// * login controller
const loginC = async (req, res) => {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
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
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  //  refresh token 
    // refreshToken 
    const refreshToken = jwt.sign(
      { user_id: user.userId, email: user.email, role: user.role },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    )
    // send refresh token to database 
    await RefreshToken.create({
    refreshToken:refreshToken, userId: user.userId
    })
    // Set the token in the Authorization header and respond
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//! Using JWT as the token format and the Bearer scheme for transmitting it gives you the best of both worlds. JWTs provide security, statelessness, and self-contained information, while the Bearer scheme standardizes how tokens are passed between the client and server, ensuring compatibility with web standards and tools.

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

const forgotPassword = async (req, res) => {
  const { user_email } = req.body;

  try {
    const user = await User.findOne({
      attributes: ['userId', 'email'],
      where: { email: user_email }
    });
    if (user) {
      const updateLink = `http://localhost:7550/reset-password/${user.userId}`;
      await User.update({
        passwordUpdateLink: updateLink,
        passwordUpdateLinkCreatedAt: new Date()
      }, {
        where: { userId: user.userId }
      });
      const forLinkFromDB = await User.findOne({
        attributes:['passwordUpdateLink'],
        where:{userId: user.userId}
      })
      if(forLinkFromDB){
        let updateLinkFromDB = forLinkFromDB.passwordUpdateLink
        const mailSender = nodemailer.createTransport({
          service: 'gmail',
          port: 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        const details = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Password Reset Request',
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Update Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f6f6f6;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        border: 1px solid #cccccc;
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        max-width: 100px;
                    }
                    .content {
                        text-align: center;
                        padding: 20px;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 15px 25px;
                        margin: 20px 0;
                        background-color: #FF8500;
                        color: #ffffff;
                        font-weight: bold;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        font-size: 12px;
                        color: #777777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <svg width="100" height="100" xmlns="../assets/images/aspire 2.png">
                            <rect width="100" height="100" fill="#007BFF"/>
                            <text x="50" y="60" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#ffffff" text-anchor="middle" alignment-baseline="middle">Sintae job's</text>
                        </svg>
                    </div>
                    <div class="content">
                        <h1>Update your password</h1>
                        <p>Click the button below to update your password.</p>
                        <a href="${updateLinkFromDB}" class="cta-button">Update Password</a>
                </div>
                <div class="footer">
                    <p>Link will expire in <b>5min</b><p>
                    <br>
                    <p>If you did not sign up for this account, please ignore this email.</p>
                </div>
            </div>
            </body>
            </html>
          `
        };
  
        mailSender.sendMail(details, (err, info) => {
          if (err) {
            console.log('Error sending email:', err);
            return res.status(500).json({ message: 'Error sending email' });
          } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Password reset email sent' });
          }
        });
      }else{
        return res.status(500).json({ message: 'update Time expired please try again later' });
      }
   
    } else {
      return res.status(404).json({ message: 'Password reset email sent' });
    }
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
};

let updateUserPassword = async (req, res) => {
  const { user_new_password, sq1, sqa1 } = req.body;
  const { userId } = req.params; 

  try {
    const userData = await User.findOne({
      attributes: ['userId', 'email', 'sq1', 'sqa1','passwordUpdateLink'],
      where: {
        userId: userId 
      }
    });
   let userLinkFromFront = `http://localhost:7550/reset-password/${userId}`
   if(userLinkFromFront !== userData.passwordUpdateLink){
    return res.status(500).json({ message: "link expired!" });
   }else{
     if (userData && userData.sq1 !== sq1 && userData.sqa1 !== sqa1) {
       return res.status(400).json({ message: "Wrong answer for security question"});
     } else {
      const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(user_new_password, salt);
       const updateResult = await User.update(
         { password: hashPassword },
         { where: { userId: userId } }
       );
 
       if (updateResult[0] > 0) {
         return res.status(200).json({ message: "Password updated successfully" });
       } else {
         return res.status(500).json({ message: "Failed to update password. Please try again later." });
       }
     }
   }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
  }
};

let grantPrivilege = async (req,res)=>{
    const {userId} = req.params
    const {Privilege} = req.body
    try {
      if(!userId || !Privilege){
        return res.status(400).json({ errors: "All fields are required" });
      }
      const updateResult = await User.update(
        { role: Privilege },
        { where: { userId: userId } }
      );
      if (updateResult[0] > 0) {
        return res.status(200).json({ message: `Privilege of ${Privilege} granted successfully` });
      } else {
        return res.status(500).json({ message: "Failed to grant privilege, Please try again later." });
      }
    } catch (error) {
        console.log(error.message)
    }

}



module.exports = { userC, loginC, deleteUser,forgotPassword,updateUserPassword,verifyEmail,grantPrivilege };
