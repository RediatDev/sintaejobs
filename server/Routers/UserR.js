const express = require('express');
const { userC, loginC,deleteUser} = require('../controller/UserC.js'); 

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC);
userCreateRouter.post('/login', loginC);
userCreateRouter.delete('/deleteUser/:userId', deleteUser);

module.exports = {userCreateRouter};
