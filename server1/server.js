const http = require('http');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const configJwt = require('../config/config.js');
const app = express();
const mongoose = require('mongoose');
const configDB = require('../config/config.js').mongoConfig;

// const auth = require('./authentication');
const carrier = require('./carrier');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.connectionURL);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const compression = require('compression');
app.use(compression());

app.use(express.static(path.resolve(__dirname, '../', 'webclient')));

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../', 'webclient', 'assets', 'index.html', 'client'));
});

app.use('/carrier', carrier);
// app.use('/auth', auth);
// app.use(function(req,res,next){
//   try {
//     if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
//       const user = jwtDecode(req.headers.authorization.split(' ')[1]);
//       req.user = user;
//       next();
//     }else{
//       return res.status(401).send({message : "Authentication failed"});
//     }
//   } catch (e) {
//     return res.status(500).send({message : "Internal Server Error.."});
//   }
// });

app.use(function(req, res) {
    let err = new Error('Resource not found');
    err.status = 404;
    return res.status(err.status).json({error: err.message});
});

app.use(function(err, req, res) {
    logger.error('Internal error in watch processor: ', err);
    return res.status(err.status || 500).json({error: err.message});
});

//  route middleware
// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated() === true)
//         return next();
//     res.status(201).send('');
//     return 1;
// }

module.exports = app;
