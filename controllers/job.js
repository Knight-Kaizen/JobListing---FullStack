const jwt = require('jsonwebtoken');
const jobDetailCollection = require('../models/jobModel');

const verifyToken = async (req, res, next) => {
    let token = req.headers.authorization;
    token = token.slice(7);

    
    if (!token)
        res.status(400).send('Token not received');
    else {

        try {
            const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
            next();
        }
        catch (err) {
            res.send('Error in Verification');
        }
    }
}

const postJob = async (jobDetailObj) => {
    try {
        const newJob = new jobDetailCollection({
            company_name: jobDetailObj.company_name,
            recruiter_id: jobDetailObj.recruiter_id,
            logo_url: jobDetailObj.logo_url,
            job_position: jobDetailObj.job_position,
            monthly_salary: jobDetailObj.monthly_salary,
            job_type: jobDetailObj.job_type,
            remote_office: jobDetailObj.remote_office,
            location: jobDetailObj.location,
            job_description: jobDetailObj.job_description,
            company_description: jobDetailObj.company_description,
            skills_required: jobDetailObj.skills_required, //seperated by ','
            company_size: jobDetailObj.company_size

        })

        const result = await newJob.save();
        return true;
    }
    catch (err) {
        return false;
    }
}

const createJob = async (req, res) => {
    try {
        const jobPosted = await postJob(req.body);
        if (jobPosted) {
            res.send('Job posted successfully');
        }
        else {
            res.status(400).send('Job posting failed');
        }
    }
    catch (err) {
        res.send(`Error in create Job: ${err}`);
    }
}

const getAllJobs = async (query) => {
    try {
        if (Object.keys(query).length == 0) {
            const result = await jobDetailCollection.find();
            return result;
        }
        else {
            const searchOnSkills = 'skills_required' in query;
            const searchOnJobTitle = 'job_position' in query;
            // search based on job title AND skills
            if (searchOnJobTitle && searchOnSkills) {
                const result = await jobDetailCollection.find({
                    $and: [
                        {
                            'job_position': {
                                $eq: query['job_position']
                            }
                        },
                        {
                            'skills_required': {
                                $in: query['skills_required']
                            }
                        }
                    ]
                })
                return result;
            }
            else if (searchOnJobTitle) { //search based on job title
                const result = await jobDetailCollection.find(query);
                return result;
            }
            else if (searchOnSkills) { // search based on required skills
                const result = await jobDetailCollection.find({
                    'skills_required': {
                        $in: query['skills_required']
                    }
                })
                return result;
            }
        }
    }
    catch (err) {
        return false;
    }

}

const viewJobs = async (req, res) => {
    try {
        const alljobs = await getAllJobs(req.query);
        if (alljobs) {
            res.send(alljobs);
        }
        else {
            res.send('Error in fetching jobs');
        }
    }
    catch (err) {
        res.send(`Error in view jobs: ${err}`);
    }
}

const viewJobById = async (req, res) => {
    try {
        const result = await jobDetailCollection.findById(req.params.id);
        res.send(result);
    }
    catch (err) {
        res.send(`Error in view job by ID: ${err}`);
    }
}
const editJobDetails = async (req) => {
    try {
        const newDetails = req.body;
        // console.log(newDetails);
        const jobId = req.params.id;
        await jobDetailCollection.updateOne({ _id: jobId }, {
            $set: {
                job_position: newDetails.job_position,   //Frontend/Backend/Fullstack
                monthly_salary: newDetails.monthly_salary,
                job_type: newDetails.job_type,       //full-time/part-time/internship
                remote_office: newDetails.remote_office, //remote/office/hybrid
                location: newDetails.location,    //only city name required
                job_description: newDetails.job_description,
                skills_required: newDetails.skills_required, //seperated by ','
            }
        })
        return true;
    } catch (err) {
        return false
    }
}
const editJob = async (req, res) => {
    try {
        const result = await editJobDetails(req);
        if (result)
            res.send('Job details updated');
        else
            res.status(400).send('Failed to update job details');

    }
    catch (err) {
        res.send(`Error in edit JOb, ${editJob}`);
    }
}

module.exports = {
    verifyToken,
    createJob,
    viewJobs,
    viewJobById,
    editJob
}