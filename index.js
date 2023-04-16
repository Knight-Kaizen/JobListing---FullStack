const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



const app = express();
dotenv.config();




//---------------MongoDB connection----------------

mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('mongo connected'))
    .catch(err => console.log(err));
//-------------------------------------------------
app.get('/', (req,res)=>{
    res.send('Backend working');
})





app.listen(8000, ()=>{
    console.log('listening to port: 8000');
})