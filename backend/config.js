//TODOS
//Create a .env file and configure this variables:
//MONGO_DB=mongodb connection string
//UNSPLASH_ACCESS
//UNSPLASH_SECRET
//MAIL_PASSWORD=nodemailer connection password

const PORT = 8070;
const TOKEN_EXPIRATION_MINUTES = 5 * 60 * 1000;
const APP_URL = "http://54.208.30.54:36345";
module.exports = { PORT, TOKEN_EXPIRATION_MINUTES, APP_URL };
