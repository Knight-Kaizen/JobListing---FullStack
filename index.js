const express = require('express');
const mongoose = require('mongoose');



const app = express();




//---------------MongoDB connection----------------
const url = "phrh.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
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