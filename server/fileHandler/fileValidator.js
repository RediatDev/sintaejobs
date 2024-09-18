// const sharp = require('sharp');
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('ffmpeg-static');
// const fs = require('fs');

// const multer = require('multer');
// const path = require('path');
//             // multer: handles file uploads.
//             // sharp: processes image files to ensure they meet the specifications.
//             // ffmpeg: processes video files to ensure the quality and size requirements.
// //* Set ffmpeg path
// ffmpeg.setFfmpegPath(ffmpegPath);
// //* Image processing function (for 72 DPI, 150KB, 468x60 PNG)
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

// //* Upload controller
// const uploadFiles = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).send('No file uploaded.');
//     if (file.mimetype.startsWith('image/')) {
//       await processImage(file.path);
//       res.status(200).send('Image uploaded and processed successfully');
//     } else if (file.mimetype.startsWith('video/')) {
//       await processVideo(file.path);
//       res.status(200).send('Video uploaded and processed successfully');
//     }
//   } catch (error) {
//     res.status(500).send(`Error: ${error.message}`);
//   }
// };

// //* Create folder paths if they don't exist
// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, "fileHandler/photoStore/"); // Save to photoStore
//     } else if (file.mimetype.startsWith('video/')) {
//       cb(null, "fileHandler/videoStore"); // Save to videoStore
//     } else {
//       cb({ message: 'This file type is not supported' }, false);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// // File filter for specific types
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     if (file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb({ message: 'Only PNG files are allowed' }, false);
//     }
//   } else if (file.mimetype.startsWith('video/')) {
//     if (file.mimetype === 'video/mp4') {
//       cb(null, true);
//     } else {
//       cb({ message: 'Only MP4 videos are allowed' }, false);
//     }
//   } else {
//     cb({ message: 'Unsupported file type' }, false);
//   }
// };

// // Set file size limits
// const limits = {
//   fileSize: 20 * 1024 * 1024 // 20 MB limit for video files
// };

// // Multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits
// });

// module.exports = {upload,uploadFiles};
//         // video quality should be 
//             // minimum 760px HD and above
//             // size limit 20MB 
//             // VIDEO FORMAT MP4 


//         // photo quality
//             // png 
//             // 72 dots per inch 
//             // 150KB size 
//             // 468x60 pixels


const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Image processing function (72 DPI, 150KB, 468x60 PNG)
const processImage = async (filePath) => {
  try {
    await sharp(filePath)
      .resize(468, 60)
      .png({ compressionLevel: 9 })
      .toBuffer()
      .then(data => fs.writeFileSync(filePath, data));

    const { size } = fs.statSync(filePath);
    if (size > 150 * 1024) throw new Error('Image exceeds size limit of 150KB');
  } catch (error) {
    throw new Error(`Image processing error: ${error.message}`);
  }
};

// Video processing function (min 760px HD, size limit 20MB)
const processVideo = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .videoCodec('libx264')
      .size('760x?') // Minimum width 760px
      .on('end', () => resolve())
      .on('error', (err) => reject(new Error(`Video processing error: ${err.message}`)))
      .save(filePath); // Overwrite the file with processed video
  });
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;
    if (file.mimetype.startsWith('image/')) {
      folderPath = "fileHandler/photoStore/";
    } else if (file.mimetype.startsWith('video/')) {
      folderPath = "fileHandler/videoStore";
    } else {
      return cb(new Error('This file type is not supported'), false);
    }

    ensureDirectoryExists(folderPath);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for specific types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      req.fileValidationError = 'Only PNG files are allowed';
      cb(null, false);
    }
  } else if (file.mimetype.startsWith('video/')) {
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      req.fileValidationError = 'Only MP4 videos are allowed';
      cb(null, false);
    }
  } else {
    req.fileValidationError = 'Unsupported file type';
    cb(null, false);
  }
};

// Set file size limits
const limits = {
  fileSize: 20 * 1024 * 1024 // 20 MB limit for video files
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits
});

// Upload controller
const uploadFiles = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded.');
    
    if (file.mimetype.startsWith('image/')) {
      await processImage(file.path);
      res.status(200).send('Image uploaded and processed successfully');
    } else if (file.mimetype.startsWith('video/')) {
      await processVideo(file.path);
      res.status(200).send('Video uploaded and processed successfully');
    }
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
};

module.exports = { upload, uploadFiles };
