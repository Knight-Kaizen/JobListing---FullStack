const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



const app = express();
dotenv.config();




//---------------MongoDB----------------

//-------Connection
mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err));

//--------Schema
const jobDetailsSchema = new mongoose.Schema({
    company_name: String,
    logo_url: String,
    job_position: String,   //Frontend/Backend/Fullstack
    monthly_salary: String, 
    job_type: String,       //full-time/part-time/internship
    remote_office: String, //remote/office/hybrid
    location: String,    //only city name required
    job_description: String,
    company_description: String,
    skills_required: String //seperated by ','
})


//-------------------------------------------------
app.get('/', (req, res) => {
    res.send('Backend working');
})





app.listen(8000, () => {
    console.log('listening to port: 8000');
})