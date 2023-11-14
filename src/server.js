const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes')
const path = require('path')
const app = express();

app.use(bodyParser.json());

// Example middleware for user authentication (assuming user ID is passed in the request header)
app.use((req, res, next) => {
  req.user = 'exampleUserId'; // Replace with your actual user authentication logic
  next();
});
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.use('/api', routes);

mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
});


const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });  

