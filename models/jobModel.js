const mongoose = require('mongoose');

const jobDetailsSchema = new mongoose.Schema({
    company_name: String,
    logo_url: String,
    job_position: String,   //Frontend/Backend/Fullstack
    monthly_salary: Number,
    job_type: String,       //full-time/part-time/internship
    remote_office: String, //remote/office/hybrid
    location: String,    //only city name required
    job_description: String,
    company_description: String,
    skills_required: [], //seperated by ','
    company_size: String,
    recruiter_id: String
})
module.exports = new mongoose.model("jobDetailCollection", jobDetailsSchema);
