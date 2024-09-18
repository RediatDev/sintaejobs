const express = require("express");
const {userCreateRouter} = require('./Routers/UserR.js')
const {AdRouter} = require('./Routers/AdvertR.js')
const {jobRouter} = require('./Routers/JobR.js')
// const {fileUploader}=require('./Routers/fileUploader.js')
const AllRouters = express.Router();

AllRouters.use('/users',userCreateRouter)
AllRouters.use('/Advert',AdRouter)
AllRouters.use('/Job',jobRouter)
// AllRouters.use('/files',fileUploader)

module.exports={AllRouters}