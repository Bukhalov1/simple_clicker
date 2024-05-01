console.log("app.js is started...")

const mongoose = require('mongoose');
const User = require('./User');

const express = require("express");
const app = express();
const PORT = 3000;


// connect to db
mongoose.connect('mongodb://localhost:27017/gameDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err)
);


  

// Middleware для логирования IP-адресов
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`Access from IP: ${ip}`);
    next(); // Передаем управление следующему middleware
  });

// load static
app.use(express.static('public'));

// load site
app.get('/',(req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


app.use(express.json()); // Для парсинга JSON

// Обработка POST-запроса
app.post('/send-user-data', (req, res) => {
    console.log('Got user data:', req.body);
    res.status(200).json({ message: "Succses in getting user data", yourData: req.body });

    // Использование модели User
    // id: 397033764,
    // firstName: 'Kastorsky',
    // lastName: '',
    // username: 'Kastorsky1'

    const newUser = new User({ id: req.body.id, 
                            username: req.body.username, 
                            firstName: req.body.firstName, 
                            lastName: req.body.lastName, 
                            score: 100 });

    newUser.save().then(() => console.log('User saved!'));
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});