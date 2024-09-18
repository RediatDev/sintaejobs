// const { sequelize, Advert,AdvertBackup } = require('../models');
// const sharp = require('sharp');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static');
// const fs = require('fs');

// const multer = require('multer');
// const path = require('path');
// let insertAdvert = async (req,res)=>{
//     const { userId,advertDescription,status,adDuration} = req.body;
//     const file = req.file;  
//  //* Set ffmpeg path
// ffmpeg.setFfmpegPath(ffmpegPath);
// //* Image processing function (for 72 DPI, 150KB, 468x60 PNG)
// let adPhotoLink = null;
// let adVideoLink = null;
// const processImage = async (filePath) => {
//   try {
//     await sharp(filePath)
//       .resize(468, 60)
//       .png({ compressionLevel: 9 })
//       .toBuffer()
//       .then(data => fs.writeFileSync(filePath, data));

//     const { size } = fs.statSync(filePath);
//     if (size > 150 * 1024) throw new Error('Image exceeds size limit of 150KB');
//   } catch (error) {
//     throw new Error(`Image processing error: ${error.message}`);
//   }
// };
// //* Video processing function (min 760px HD, size limit 20MB)
// const processVideo = (filePath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg(filePath)
//       .videoCodec('libx264')
//       .size('760x?') // Minimum width 760px
//       .on('end', () => resolve())
//       .on('error', (err) => reject(new Error(`Video processing error: ${err.message}`)))
//       .save(filePath); // Overwrite the file with processed video
//   });
// }; 
//     try {
//     if(!file){
//         return res.status(400).send('No file uploaded.');
//     }else{
//         if (file.mimetype.startsWith('image/')) {
//             await processImage(file.path);
//             adPhotoLink = `/photoStore/${req.file.filename}`;
//             res.status(200).send('Image uploaded and processed successfully');
//           } else if (file.mimetype.startsWith('video/')) {
//             await processVideo(file.path);
//             adVideoLink = `/videoStore/${req.file.filename}`;
//             res.status(200).send('Video uploaded and processed successfully');
//           }
//     }
//         await Advert.create({
//             advertDescription,
//             adVideoLink,
//             adPhotoLink,
//             adDuration,
//             status,
//             userId,
//         });
//         await AdvertBackup.create({
//             advertDescription,
//             adVideoLink,
//             adPhotoLink,
//             adDuration,
//             status,
//             userId,
//         });
        

//         res.status(201).json({ message: 'Advert created successfully' });
//     } catch (error) {

//         res.status(500).json({ message: error.message });
//     }
// }

// * correction using chtGPT
const { Advert, AdvertBackup } = require('../models');
const {upload} =require('../fileHandler/fileValidator.js')

// Set ffmpeg path

// Controller for inserting an advert
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
        return res.status(400).send('All fields including advert photo or video are required');
      }
  
     
      await Advert.create({
        advertDescription,
        adMediaLink,
        userId,
      });
  
      // Create a backup entry
      await AdvertBackup.create({
        advertDescription,
        adMediaLink,
        userId,
      });
  
      // Return success response
      res.status(201).json({ message: 'Advert created successfully' });
    } catch (error) {
      // Handle any errors that occur during the database operations
      res.status(500).json({ message: error.message });
    }
  };
// * chatGPT assist end here
let updateAdvert = async (req,res)=>{
    const { advertId } = req.params;
    const updateFields = ['advertDescription', 'status', 'adDuration', 'adPhoto', 'adVideo', 'userId'];
    try {
        const advert = await Advert.findByPk(advertId);

        if (!advert) {
            return res.status(404).json({ message: 'Advert not found' });
        }

        // Dynamically update only the provided fields
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                advert[field] = req.body[field];
            }
        });

        await advert.save();

        res.json({ message: 'Advert updated successfully', advert });
    } catch (error) {
   
        res.status(500).json({ message: error.message });
    }
}

let deleteAdvert = async (req,res)=>{
    const { advertId } = req.params;

    try {
        const advert = await Advert.findByPk(advertId);

        if (!advert) {
            return res.status(404).json({ message: 'Advert not found' });
        }

        await advert.destroy();

        res.json({ message: 'Advert deleted successfully' });
    } catch (error) {
       
        res.status(500).json({ message: error.message });
    }
}
module.exports ={deleteAdvert,updateAdvert,insertAdvert}