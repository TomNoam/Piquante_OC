require('dotenv').config();
const express = require('express');
const helmet = require ('helmet');

const app = express();

const path = require('path');

app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: false,
 }
));

require('./models/dbConfig');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
  
app.get('/', (req, res, next) => {
  res.status(200).json({
    msg: 'api works'
  });
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

app.listen(3000, ()=> console.log('server listening 3000'));