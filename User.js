
const mongoose = require('mongoose');

// connect to db
mongoose.connect('mongodb://localhost:27017/gameDB')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err)
);

const userSchema = new mongoose.Schema({
    username: String,
    score: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

