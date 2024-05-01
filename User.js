// User.js
const mongoose = require('mongoose');

// Определение схемы 
const userSchema = new mongoose.Schema({
    username: { type: String, required: false },
    firstName: { type: Number, required: false },
    wallet: { type: String, required: false },
    score: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

// Создание модели на основе схемы
const User = mongoose.model('User', userSchema);

module.exports = User;