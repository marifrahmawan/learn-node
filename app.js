const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
const feedRoutes = require('./routes/feedRouter');

//Use the Router
app.use(feedRoutes);

app.listen(3000, async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/deblog');
  console.log('server listening to http://localhost:3000');
});
