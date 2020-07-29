//=========================================
//PORT
//=========================================
process.env.PORT = process.env.PORT || 3000;

//=========================================
//ENVIRONMENT
//=========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================
//DATABASE
//=========================================
let urlDB;

if(process.env.NODE_ENV == 'dev'){
    urlDB = 'mongodb://localhost:27017/courseDB';
}
else{
    urlDB = process.env.MONGO_URL;
}

process.env.URL_DB = urlDB;

//=========================================
//TOKEN EXPIRATION
//=========================================
process.env.TOKEN_EXPIRATION = "1hrs";

//=========================================
//SEED
//=========================================
process.env.SEED = process.env.SEED || 'development-seed';

//=========================================
//GOOGLE CLIENT ID
//=========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '242427929-695s6q7ammuj5fuft3l9l6g9a700ftnj.apps.googleusercontent.com';