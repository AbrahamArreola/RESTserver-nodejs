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