const express = require('express');
const { userC, loginC,deleteUser,forgotPassword,updateUserPassword,verifyEmail,grantPrivilege} = require('../controller/UserC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let userCreateRouter = express.Router();

userCreateRouter.post('/createUser', userC);
userCreateRouter.post('/login', loginC);
userCreateRouter.delete('/deleteUser/:userId',authenticateToken,checkRole(["1"]), deleteUser);
userCreateRouter.post('/email-pass', forgotPassword);
userCreateRouter.post('/updatePassword/:userId',updateUserPassword );
userCreateRouter.get('/verify/:encryptedJWT/:encryptionKey/:iv',verifyEmail );
userCreateRouter.post('/privilege/:userId',authenticateToken,checkRole(["1"]),grantPrivilege );


module.exports = {userCreateRouter};
