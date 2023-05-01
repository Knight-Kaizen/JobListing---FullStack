# JobListing---FullStack
### This is a backend for a joblisting platform I am working on.
### Used Node.js and express for backend and used mongoDB as Database.
### This is hosted on render. [Link](https://jobfinder-backend.onrender.com/)

## About jobListing platform
- This will be a platform which will caters the needs of both developers and recruiters. 
- Recruiters need to register themselves before posting any new job. They can login and post new jobs,
  also they can edit or delete the jobs posted by them.
- Developers can view jobs, search jobs based on position and also filter jobs based on skills.

## Topics I touched while building it: 
- Password Hashing: Used bcrypt for hashing password.
- Authentication: checking weather recruiter's email already exists or not, and matching passwords. 
- Authorization: Used JWT tokens for authorization, so registered recruiters can only post jobs.
- Querying Database: Simple query for searching with job title and nested query for filtering jobs on basis of skills.
- Enviornment variables: To hide sensitive data in source code.
- Error Handling: Handled errors on different stages and sending appropriate responses with 400 as status code.


## API Documentation
Will write API documentation later on so it can be tested out on tools like POSTMAN.

