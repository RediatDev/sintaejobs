const express = require('express');
const { userC, loginC} = require('../controller/UserC.js'); 

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC);
userCreateRouter.post('/login', loginC);

module.exports = {userCreateRouter};
