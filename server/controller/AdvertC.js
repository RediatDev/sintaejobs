// * Correction using chtGPT
const { Advert, AdvertBackup, User } = require("../models");
const { upload } = require("../fileHandler/fileValidator.js");
const nodemailer = require("nodemailer");

//* Set ffmpeg path

//* Controller for inserting an advert
const insertAdvert = async (req, res) => {
  const { advertDescription } = req.body;
  const { userId } = req.params;
  const adMediaLink = req.file ? req.file.path : null;

  try {
    if (req.fileValidationError) {
      return res.status(400).send(`Error: ${req.fileValidationError}`);
    }

    //* Validate required fields
    if (!adMediaLink || !userId || !advertDescription) {
      return res
        .status(400)
        .send("All fields including advert photo or video are required");
    }

    await Advert.create({
      advertDescription,
      adMediaLink,
      userId,
      mediaType: req.file.mimetype,
    });

    await AdvertBackup.create({
      advertDescription,
      adMediaLink,
      userId,
      mediaType: req.file.mimetype,
    });

    res.status(201).json({ message: "Advert created successfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// * ChatGPT assist end here
let updateAdvert = async (req, res) => {
  const { advertId } = req.params;
  const updateFields = [
    "advertDescription",
    "status",
    "adDuration",
    "adPhoto",
    "adVideo",
    "userId",
  ];
  try {
    const advert = await Advert.findByPk(advertId);

    if (!advert) {
      return res.status(404).json({ message: "Advert not found" });
    }

    // Dynamically update only the provided fields
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        advert[field] = req.body[field];
      }
    });

    await advert.save();

    res.json({ message: "Advert updated successfully", advert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//* Delete user
let deleteAdvert = async (req, res) => {
  const { advertId } = req.params;

  try {
    const advert = await Advert.findByPk(advertId);

    if (!advert) {
      return res.status(404).json({ message: "Advert not found" });
    }

    await advert.destroy();

    res.json({ message: "Advert deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* get all uploaded media file
let getAllMedia = async (req, res) => {
  try {
    const adverts = await Advert.findAll({
      include: [
        {
          model: User,
          attributes: ["userId", "userName", "email"],
        },
      ],
      order: [["adTimestamp", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: adverts,
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching media",
      error: error.message,
    });
  }
};

//* admin review section for uploading
let adminReview = async (req, res) => {
  const { advertId,userId } = req.params;
  const { updateStatus, amountToBePayed } = req.body;
  try {
    // 'Approved', 'Pending', 'UnderReview', 'Denied','Requested to pay','Uploaded'
    if (updateStatus === "Requested to pay") {
      const updateAdvert = await Advert.update(
        { status: updateStatus },
        { where: { advertId: advertId } }
      );
      const updateAdvertBackup = await Advert.update(
        { status: updateStatus },
        { where: { advertId: advertId } }
      );

      if (updateAdvert[0] === 1 && updateAdvertBackup[0] === 1) {
        // * email sending for payment request

        const mailSender = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        //* payment link or some sort of solution for payment navigation
        const details = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Payment Request for Your Advert Submission on ASPIRE",
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
                      <text x="50" y="60" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#ffffff" text-anchor="middle" alignment-baseline="middle">ASPIRE</text>
                  </svg>
              </div>
              <div class="content">
                  <h1>Payment Request for Your Advert Submission on ASPIRE</h1>
                  <p>Thank you for your recent advertisement submission on our site.</p>
                  <p>As per your ad post request, a payment of ${amountToBePayed} is required for your uploaded advert to go live. Once your payment is completed, and in accordance with our contractual agreement, your media file will be live on our site within 6 hours. Please note that the countdown for the advert media file duration on our site will begin once it is live.If you wish to make a payment in a currency other than USD, please contact our customer service team for assistance.</p>
                  <p>To proceed with your payment, kindly click the button below</p>
                  <a href="" class="cta-button">Update Password</a>

          </div>
          <div class="footer">
              <p>Thank you for choosing .<b>ASPIRE</b><p>
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
            console.log("Error sending email:", err);
            return res.status(500).json({ message: "Error sending email" });
          } else {
            console.log("Email sent:", info.response);
            return res
              .status(200)
              .json({ message: "Password reset email sent" });
          }
        });
      }
    } else if (updateStatus === "Denied") {
      //* email sending for declined request
      const updateAdvert = await Advert.update(
        { status: updateStatus },
        { where: { advertId: advertId } }
      );
      const updateAdvertBackup = await Advert.update(
        { status: updateStatus },
        { where: { advertId: advertId } }
      );
      if (updateAdvert[0] === 1 && updateAdvertBackup[0] === 1) {
        const mailSender = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        const details = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Request Decline for Your Advert Submission on ASPIRE",
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
                                  <text x="50" y="60" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#ffffff" text-anchor="middle" alignment-baseline="middle">ASPIRE</text>
                              </svg>
                          </div>
                          <div class="content">
                              <h1>Request Decline for Your Advert Submission on ASPIRE</h1>
                              <p>Thank you for your recent advertisement submission on our site.</p>
                              <p>We regret to inform you that, in accordance with our established rules and policies, your recent request for advert promotion on our site has been declined.You are welcome to re-upload your content, ensuring it meets the specifications outlined in our standard documentation.</p>
            
                      </div>
                      <div class="footer">
                          <p>Thank you for choosing .<b>ASPIRE</b><p>
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
            console.log("Error sending email:", err);
            return res.status(500).json({ message: "Error sending email" });
          } else {
            console.log("Email sent:", info.response);
            return res.status(200).json({ message: "Password reset email sent" });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  deleteAdvert,
  updateAdvert,
  insertAdvert,
  adminReview,
  getAllMedia,
};
