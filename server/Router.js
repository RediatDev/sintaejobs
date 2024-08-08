const express = require("express");
const {userCreateRouter} = require('./Routers/UserR.js')
const AllRouters = express.Router();

AllRouters.use('/users',userCreateRouter)

module.exports={AllRouters}