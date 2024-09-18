const express = require('express');
const {createJob,updateJob,deleteJob} = require('../controller/JobC.js'); 
const {checkRole,authenticateToken} = require('../Auth/Auth.js')

let jobRouter = express.Router();

jobRouter.post('/createJob',authenticateToken,checkRole(["1","2","3","4","5"]), createJob);
jobRouter.patch('/updateJob/:jobId',authenticateToken,checkRole(["1","2","3","4","5"]), updateJob);
jobRouter.delete('/deleteJob/:jobId',authenticateToken,checkRole(["1","2","3","4","5"]), deleteJob);

module.exports = {jobRouter};
