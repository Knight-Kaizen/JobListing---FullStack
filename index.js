const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/connectDB');
const userController = require('./controllers/user');
const jobController = require('./controllers/job');

const app = express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000"
}))

const port = process.env.PORT || 8000;

connectDB();

app.get('/', (req, res) => res.send('Backend working'));

app.post('/register', userController.validateUser, userController.createUser);
app.post('/login', userController.loginUser);

app.post('/job', jobController.verifyToken, jobController.createJob);
app.get('/job', jobController.viewJobs);
app.get('/view/:id', jobController.viewJobById);
app.patch('/edit/:id', jobController.editJob);


app.listen(port, () => {
    console.log('listening to port:', port);
})