const express = require('express');
const {updateAdvert,insertAdvert,deleteAdvert} = require('../controller/AdvertC.js'); 

let AdRouter = express.Router();

AdRouter.post('/createAd', insertAdvert);
AdRouter.patch('/updateAd/:advertId', updateAdvert);
AdRouter.delete('/deleteAd/:advertId', deleteAdvert);

module.exports = {AdRouter};
