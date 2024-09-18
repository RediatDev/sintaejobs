const { sequelize, Job ,JobBackup} = require('../models');
let createJob = async (req,res)=>{
    const {jobCategory,jobDescription,jobSalary,jobLocation,jobType,jobAcceptance,jobDeadline,jobGender,userId} = req.body
    try {
        await Job.create({
            jobCategory,
            jobDescription,
            jobSalary,
            jobLocation,
            jobType,
            jobAcceptance,
            jobDeadline,
            jobGender,
            userId,
        });
        await JobBackup.create({
            jobCategory,
            jobDescription,
            jobSalary,
            jobLocation,
            jobType,
            jobAcceptance,
            jobDeadline,
            jobGender,
            userId,
        });
     


        res.status(201).json({ message: 'Job created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

let updateJob = async (req, res) => {
    const { jobId } = req.params;
    const updateFields = ['jobCategory', 'jobDescription', 'jobSalary', 'jobLocation', 'jobType', 'jobAcceptance', 'jobDeadline', 'jobGender', 'userId'];

    try {
        const job = await Job.findByPk(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Dynamically update only the provided fields
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field]; // Update field with the provided value
            }
        });

        await job.save(); // Save changes

        res.json({ message: 'Job updated successfully', job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


let deleteJob = async(req,res)=>{
    const { jobId } = req.params;
    try {
        const storedJob = await Job.findByPk(jobId);

        if (!storedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await Job.destroy({
            where: { jobId } 
        });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      
        res.status(500).json({ message: error.message });
    }
}

module.exports ={createJob,updateJob,deleteJob}