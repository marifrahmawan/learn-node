require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

//* Set the headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Router
const articleRoutes = require('./routes/articleRouter');
const authRoutes = require('./routes/authRouter');
const userhRoutes = require('./routes/userRouter');

//Use the Router
app.use('/feed', articleRoutes);
app.use('/auth', authRoutes);
app.use('/user', userhRoutes);

//* Error Middleware
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const errorContent = error.errorContent || [];

  return res
    .status(statusCode)
    .json({ msg: message, errorContent: errorContent });
});

app.listen(8080, async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/deblog');
  console.log('server listening to http://localhost:8080');
});
