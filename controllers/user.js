const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDetailCollection = require('../models/userModel');

const validateUser = async (req, res, next) => {
    try {
        //check for name, email, mobile and password.
        //Since we will be having onwe will valily one user date if the user is dup licate or notby email & mobile
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            res.status(400).send('Empty Input Feilds');
        }
        //Check redundancy
        const isEmailExist = await userDetailCollection.findOne({ email });
        const ismobileExist = await userDetailCollection.findOne({ mobile });


        if (isEmailExist || ismobileExist) {
            res.status(400).send('Mobile or Email already exists!');
        }
        else {
            next();
        }
    }
    catch (err) {
        res.send(`Error in validating user, ${err}`);
    }
}

const createUser = async(req, res)=>{
    try{
        let encryptedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new userDetailCollection({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: encryptedPassword

        })
        const result = await newUser.save();
        res.send('User registered sucessfully! Head on to login page');
    }
    catch(err){
        res.send(`Error in creating user, ${err}`);
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
const getRecruiterDetails = async(userDetailObj)=>{
    const {email} = userDetailObj;
    const user = await userDetailCollection.findOne({email});
    return user;
}

const loginUser = async(req, res)=>{
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            res.send('Empty user inputs!');
        }
        const isEmailExist = await userDetailCollection.findOne({ email });
        if (isEmailExist) {
            console.log('Welcome to login page');
            const detailsOK = await matchCredentials(req.body);
            if (detailsOK) {
                console.log('Genrating token');
                const token = await generateToken(req.body);
                console.log('User sucessfully logged in!');
                console.log('User logged in sucessfully, view job page');
                const recruiterdetails = await getRecruiterDetails(req.body);
                const {name, _id} = recruiterdetails;
                res.send({
                    _id,
                    name,
                    token
                });
            }
            else {
                res.status(400).send('Wrong Email or Password!');
            }
        }
        else {
            res.status(400).send('User does not exist');
        }
    }
    catch(err){
        res.send(`Error in login user: ${err}`);
    }
}

module.exports = {
    validateUser,
    createUser,
    loginUser
}