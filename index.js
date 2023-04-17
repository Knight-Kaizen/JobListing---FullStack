const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//-----------------Middleware-------------------------

//-----------Error handler if route is not found
// It is not working, check with Ishar
// app.use((req, res, next)=>{
//     res.status(404)
//     res.send({
//         error: "Page not found"
//     });
// });

//-----------Custom middleware for validating user
const validateUser = async (req, res, next) => {
    try {
        //check for name, email, mobile and password.
        //Since we will be having onwe will valily one user date if the user is dup licate or notby email & mobile
        console.log("validateUser ", req.body);
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            console.log('Empty input feilds');
            res.status(400).send('Empty Input Feilds');
        }
        //Check redundancy
        const isEmailExist = await userDetailCollection.findOne({ email });
        const ismobileExist = await userDetailCollection.findOne({ mobile });


        if (isEmailExist || ismobileExist) {
            res.status(400).send('Mobile or Email already exists!');
            console.log("data redundancy found");
        }
        else {
            next();
        }
    }
    catch (err) {
        console.log('error in validateUser: ', err);
    }
}

//-------------------Token verification middleware
const verifyToken = async (req, res, next) => {
    const token = req.body.token;
    if (!token)
        res.status(400).send('Token not received');
    else {

        try {
            const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
            console.log('decoded token: ', decodedToken);
            next();
        }
        catch (err) {
            console.log('Error in verifyToken', err);
            res.send('Error in Verification');
        }
    }
}
//---------------------------------------


//---------------MongoDB----------------

//-------Connection
mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err));

//--------Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String
})
const userDetailCollection = new mongoose.model("userDetailCollection", userSchema);


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
    skills_required: String, //seperated by ','
    company_size: String
})
const jobDetailCollection = new mongoose.model("jobDetailCollection", jobDetailsSchema);
//------------------------------------------------------

//---------------Helper Functions-----------------------

const postJob = async (jobDetailObj) => {
    try {
        const newJob = new jobDetailCollection({
            company_name: jobDetailObj.company_name,
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
        console.log('Error while posting a job ', (err));
        return false;
    }
}

const generateToken = async (userDetailObj) => {
    try {
        const { email } = userDetailObj;
        const user = await userDetailCollection.findOne({ email });
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );
        return token;
    }
    catch (err) {
        console.log('error in generating token: ', err);
    }
}

const matchCredentials = async (userDetailObj) => {
    try {
        const { email, password } = userDetailObj;
        const user = await userDetailCollection.findOne({ email });
        if (user && await (bcrypt.compare(password, user.password))) {
            console.log('Credentials matched');
            return true;
        }
        else {
            console.log('Wrong Credentials!');
            return false;
        }
    }
    catch (err) {
        console.error('Error in matchCredentials Helper', err);
    }


}

const checkIfUserAlreadyExist = async (userDetailObj) => {
    try {
        const { email, mobile } = userDetailObj;
        const isEmailExist = await userDetailCollection.findOne({ email });
        const ismobileExist = await userDetailCollection.findOne({ mobile });

        if (isEmailExist && ismobileExist) {
            // console.log('User Already exist');
            return true;
        }
        // console.log('User doesn\'t exist');
        return false;
    }
    catch (err) {
        console.log('Error in checkIfUserAlready exists', err);
    }

}



const createUser = async (userDetail) => {
    try {
        let encryptedPassword = await bcrypt.hash(userDetail.password, 10);
        const newUser = new userDetailCollection({
            name: userDetail.name,
            email: userDetail.email,
            mobile: userDetail.mobile,
            password: encryptedPassword

        })

        const result = await newUser.save();
        return true;
    }
    catch (err) {
        console.log('error in creating new user', err);
        return false;
    }
};
//------------------------------------------------------

//---------------------Routes----------------------------

//----------HomeRoute
app.get('/', (req, res) => {
    res.send('Backend working');
})

//---------RegisterRoute

app.post('/register', validateUser, (req, res) => {
    createUser(req.body);
    res.send('User registered sucessfully! Head on to login page');
})

//---------LoginRoute
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.send('Empty user inputs!');
        }
        const checkUserExist = await checkIfUserAlreadyExist(req.body);
        if (checkUserExist) {
            console.log('Welcome to login page');
            const detailsOK = await matchCredentials(req.body);
            if (detailsOK) {
                console.log('Genrating token');
                const token = await generateToken(req.body);
                console.log('User sucessfully logged in!');
                res.send(token);
            }
            else {
                res.status(400).send('Wrong Email or Password!');
            }
        }
        else {
            res.status(400).send('User does not exist');
        }

    }
    catch (err) {
        console.log('Error in POST login route', err);
    }

})
//------------Protected Route for Job posting
app.post('/jobpost', verifyToken, async (req, res) => {
    console.log('You can post job now!');
    const jobPosted = await postJob(req.body);
    if (jobPosted) {
        res.send('Job posted successfully');
        console.log('Job posted successfully!');
    }
    else {
        res.status(400).send('Job posting failed');
        console.log('Job posting failed');
    }
})

//---------------------------------------------------------





app.listen(8000, () => {
    console.log('listening to port: 8000');
})