const express = require('express');
const {updateAdvert,insertAdvert,deleteAdvert} = require('../controller/AdvertC.js'); 
const {upload}=require('../fileHandler/fileValidator.js')
const { checkRole,authenticateToken } = require('../Auth/Auth.js');

let AdRouter = express.Router();

AdRouter.post('/createAd/:userId', authenticateToken, checkRole(["1", "2", "5"]), upload.single('mediaFile'), insertAdvert);
AdRouter.patch('/updateAd/:advertId',checkRole(["1"]), updateAdvert);
AdRouter.delete('/deleteAd/:advertId',checkRole(["1"]), deleteAdvert);

module.exports = {AdRouter};
