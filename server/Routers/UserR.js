const express = require('express');
const { userC, loginC,deleteUser,forgotPassword,updateUserPassword} = require('../controller/UserC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC);
userCreateRouter.post('/login', loginC);
userCreateRouter.delete('/deleteUser/:userId',authenticateToken,checkRole(["1"]), deleteUser);
userCreateRouter.post('/email-pass', forgotPassword);
userCreateRouter.post('/updatePassword/:userId',updateUserPassword );


module.exports = {userCreateRouter};
