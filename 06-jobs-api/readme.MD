## Jobs API

The api is created so that users can keep a track of all the jobs they have applied for by sending a post request to the server and mention the specific properties like _position_, _company_, _job status_, etc.

When people are looking for jobs, they apply to a dozens of places and at times it bacomes very tedious to manage and maintain every single one of them. Solving this problem is the main objective of this API.

## Preview

The API is deployed live to heroku at https://jobs-api-o6-dk.herokuapp.com/ with awesome documentation using Swagger UI.

## Packages & Security

- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js#readme) - hash passwords to make them secure
- [helmet](https://helmetjs.github.io/) - prevents security attacks
- [cors](https://github.com/expressjs/cors#readme) - makes api accessible to multiple domains rather than the same one
- [xss-clean](https://github.com/jsonmaur/xss-clean) - sanitizes the user input from malicious code
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - limit the user requests
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) - adds swagger to our application
- [yamljs](https://github.com/jeremyfa/yaml.js#readme) - convert yaml code to something swagger ui can understand

## Models

#### User Model

- name [string, 3-50 char]
- email [string, unique, match the regex below]
  Email Validation Regex
  ```regex
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ```
- password [string, min. 6 char]

#### Jobs Model

- company name [string, 0-50 char]
- the position [string, 0-100 char]
- job status [default - pending, choose from rest]
- created by [user who created it, id via User model]
- timestamps are on

## Middlewares

#### Auth Middleware

Used to handle the authentication part of the app

- Get the auth header
- Verify its syntax
- Extract the JWT token
- Get the token specific data (payload)
- Create a user object in req so it can be accessed in the routes
- Add the middleware to all the required routes
- If all routes need it, add it next to the base api url in the app.js

#### Error Handler

Used to handle all types of mongoose and server errors

#### Not Found

Used to handle errors for the routes that don't exits

## Routes

#### _auth.js_ - used for user authentication

- register user - `app.post('/api/v1/auth/register', register)`
- login a new user - `app.post('/api/v1/auth/login', login)`

#### _jobs.js_ - used for CRUD operations for jobs

> Note that all the routes below need authentication first.

- get all jobs - `app.get('/api/v1/jobs', getAllJobs)`
- get single job - `app.get('/api/v1/jobs/:id', getJob)`
- create job - `app.post('/api/v1/jobs', createJob)`
- update job - `app.pacth('/api/v1/jobs/:id', updateJob)`
- delete job - `app.delete('/api/v1/jobs/:id', deleteJob)`

## Controllers

#### **auth.js** - responsible for user authentication

1. Register User

   - Get user data from req.body
   - Validate - name, email, password - with Mongoose [optional]
   - Hash Password with mongoose middleware (using bcryptjs)
   - Save User
   - Generate Token [mongoose instance method]
   - Send Response with Token

2. Login User
   - Validate if email and password are provided
   - If email or password is missing, throw BadRequestError
   - Find user by email
   - Compare Passwords using bcrypt
   - If no user or the password does not match, throw UnauthenticatedError
   - If correct, generate Token
   - Send Response with Token

#### **jobs.js** - responsible for CRUD functionality of jobs

1. Create Job

   - Add the user id as new property on req.body
   - Create a job using the mongoose **create** method
   - Send the job as a response where job is an object with details as its properties

2. Get All Jobs

   - Used **find** method to get all jobs
   - Filter them using the **createdBy** property to only get user specific jobs
   - Sort them by the **createdAt** property
   - Send the jobs as a response along with jobs count

3. Get Single Job

   - Get the **userId** from `req.user`
   - Get the **jobId** from `req.params`
   - Use **findOne** method to find the single job by jobId and userId
   - Throw 404 error if job isn't found
   - Send the job as the response

4. Update Job

   - Get the **userId** from `req.user`
   - Get the **jobId** from `req.params`
   - Get the current **company** and **position** from `req.body`
   - Check if company and position isn' empty
   - Use **findOneAndUpdate** method to update the job
   - Throw error if job isn't found
   - Send the updated job as a response

5. Delete Job

   - Get the **userId** and **jobId** from `request object`
   - Use **findOneAndRemove** method to find specific job and delete it
   - Throw error if specified job isn't found
   - Send success as a response

## Errors

> Some of the mongoose errors are customized to give the user a better experience when using the app.

#### Duplicate Error (Same Email)

Used to handle errors when the users try to register with emails that already exist in database

#### Validation Error (Wrong email/password)

Throws an error when the users don't provide valid login credentials

#### Cast Error (Uncorrect job id)

Handles errors when the job id provided isn't valid

## Notes

#### Database Connection

- Setup `.env` in the root
- Add `MONGO_URI` with correct password and database name
- Import `connect.js` in app.js
- Invoke in start() in `app.js`

#### Hashing Passwords

- Setup using `pre` aka `before hook` of mongoose middleware
- We use bcrypt.js to hash password
- Hashing is one way street, cannot be reversed back to string password
- Every input change creates a new password
- Two hashed passwords can be compared using the _compare_ method of bcrypt

#### Instance Methods

- These are the functions that we can have on our documents
- Instances of our schema where we can use `this` keyword too
- Helps to simplify controller setup

#### CORS

- Cross Origin Resource Sharing
- Mechanism to allow/restrict requested resources from a web server depending on where http req was initiated
- A cors package is used to make our API accessible to the public

#### Deployment

> The api is deployed to [Heroku](https://www.heroku.com/) at https://jobs-api-o6-dk.herokuapp.com/ and following are steps for the same.

- Create a separate copy of the application to make things easy.
- Install heroku cli and check if it is installed by typing `heroku -v` in the terminal
- Setup the installed node version in **package.json**
  `"engines":{ "node":"14.x" }`
- Change the start command in **package.json** from `nodemon app.js` to `node app.js`
- Create a new file called **Procfile** with no extensions and write `web: node app.js`
- Initlaize empty git repo `git init`
- Stage the changes `git add .`
- Commit the changes `git commit -m 'init commit'`
- Login to heroku from terminal `heroku login`
- Create new heroku application `heroku create <app name>`
- Check the remote repo `git remote -v`
- Add the env varibales using heroku GUI [command line is complex]
- Push the app to heroku `git push heroku master`
- All Done!!!

#### Documentation

> The api docs are created using Postman and [Swagger UI](https://swagger.io/) and here are the steps for the same.

- Export docs from postman by clicking on collection menu and save the json file on pc
- Format the postman exported docs using [APIMATIC](https://www.apimatic.io/) before passing it to Swagger UI
- Edit the required settings in APIMATIC
- Go back to dashboard and export the API as **OpenAPIv3.0 (YAML)**
- Copy the whole exported code and paste it in a swagger editor
- Edit the id's to dynamic ones for the route params
- Add all the yaml code to a new file in root called `swagger.yaml`
- Add the swagger middleware and `/api-docs` path to app.js
- All Done!!!

#### Local Setup

- Clone this repo first if you haven't
  ```bash
  git clone https://github.com/yodkwtf/nodejs-course.git
  ```
- Use the terminal and navigate to `06-jobs-api` directory
- Install the dependencies and run the server
  ```bash
  npm install && npm start
  ```
- Navigate to the specific port mentioned in `app.js` or test all the routes in something like postman or thunder-client.
