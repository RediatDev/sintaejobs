const express = require('express');
const {upload,uploadFiles} = require('../fileHandler/fileValidator.js')
const {authenticateToken,checkRole}=require('../Auth/Auth.js')
let fileUploader = express.Router();


fileUploader.post('/mediaUpload',authenticateToken,checkRole(["1","2","5"]), upload.single('mediaFile'), uploadFiles);
// fileUploader.post('/upload-video',authenticateToken,checkRole(["1","2","5"]), upload.single('video'), uploadFiles);


module.exports = {fileUploader};
