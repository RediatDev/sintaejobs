const express = require('express');
const {updateAdvert,insertAdvert,deleteAdvert,getAllMedia} = require('../controller/AdvertC.js'); 
const {upload}=require('../fileHandler/fileValidator.js')
const { checkRole,authenticateToken } = require('../Auth/Auth.js');

let AdRouter = express.Router();

AdRouter.post('/createAd/:userId', authenticateToken, checkRole(["1", "2", "5"]), upload.single('mediaFile'), insertAdvert);
AdRouter.patch('/updateAd/:advertId',authenticateToken,checkRole(["1"]), updateAdvert);
AdRouter.delete('/deleteAd/:advertId',authenticateToken,checkRole(["1"]), deleteAdvert);
AdRouter.get('/allUploadedAdverts',authenticateToken,checkRole(["1"]), getAllMedia);

module.exports = {AdRouter};
