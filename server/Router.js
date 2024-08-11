const express = require("express");
const {userCreateRouter} = require('./Routers/UserR.js')
const {AdRouter} = require('./Routers/AdvertR.js')
const {jobRouter} = require('./Routers/JobR.js')
const AllRouters = express.Router();

AllRouters.use('/users',userCreateRouter)
AllRouters.use('/Advert',AdRouter)
AllRouters.use('/Job',jobRouter)

module.exports={AllRouters}