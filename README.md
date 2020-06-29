# Truth Checker - a parody database for the truth

## Description
This is the API used by the Truth Checker app. It's built on a PostgreSQL database. It is a marketing piece for a music album.

## Live Site
https://truth-checker.vercel.app

## Table of Contents
1. [Screenshots](#Screenshots)
2. [Setup](#Setup)
3. [Technology](#Technology)
4. [Endpoints](#Endpoints)
5. [Scripts](#Scripts)
6. [Deploying](#Deploying)
7. [Special Thanks](#Thanks)

## Screenshots
![Screenshots 1-3](https://github.com/nick-nack-attack/truth-checker-client/raw/master/docs/screenshots/screenshots1-3.jpg)
• Main Feed, Facts, Menu
![Screenshots 4-6](https://github.com/nick-nack-attack/truth-checker-client/raw/master/docs/screenshots/screenshots4-6.jpg)
• About, Add Fact, Admin Login
![Screenshots 7-9](https://github.com/nick-nack-attack/truth-checker-client/raw/master/docs/screenshots/screenshots7-9.jpg)
• Admin Logged, Admin Menu, Reported Facts
![Screenshots 10-12](https://github.com/nick-nack-attack/truth-checker-client/raw/master/docs/screenshots/screenshots10-12.jpg)
• Edit Fact, Footer, Confirm Log Out

## Setup
Complete the following steps to start a new project (NEW-PROJECT-NAME):
1. Clone this repo to your local machine `git clone https://github.com/nick-nack-attack/truth-checker-api.git NEW-PROJECT`
2.`cd` into the cloned repository
3.Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. The .env file holds the settings for the application to be run locally.

## Technology
- React (16.13.1)
- Node (13.12.0)
- Express (4.17.1)
- PostgreSQL (12.3)

## Endpoints

### Authentication
No authentication needed other than the admin password. 
• POST `/api/auth/login`
• REFRESH `/api/auth/refresh`

### Facts
• GET `/api/facts`
• POST `/api/facts`
• GET `/api/facts/id/:fact_id`
• DELETE `/api/facts/id/:fact_id`
• PATCH `/api/facts/id/:fact_id`

### Reports
• GET `/api/reports`
• POST `/api/reports`
• GET `/api/reports/id/:report_id`
• PATCH `/api/reports/id/:report_id`

### Users
• GET `/api/users`

## Scripts

`npm start` - starts the application.

`npm run dev` - starts nodemon for the application. 

`npm test` - runs tests.

## Deploying

When your new project is ready for deployment, 
add a new Heroku application with `heroku create`. 
This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## Thanks

I would like to recognize Tiago Fassoni, Cali Stephans, and Nicholas Hazel for their continued guidance and support.
