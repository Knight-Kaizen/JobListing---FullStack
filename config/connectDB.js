const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to Database');
    }
    catch(err){
        console.log('Error connecting to DB', err);
    }
}

module.exports = connectDB;