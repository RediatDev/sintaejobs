const express = require('express');
const {createJob,updateJob,deleteJob} = require('../controller/JobC.js'); 

let jobRouter = express.Router();

jobRouter.post('/createJob', createJob);
jobRouter.patch('/updateJob/:jobId', updateJob);
jobRouter.delete('/deleteJob/:jobId', deleteJob);

module.exports = {jobRouter};
