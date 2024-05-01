console.log("app.js is started...")

const mongoose = require('mongoose');
const User = require('./User');

const express = require("express");
const app = express();
const PORT = 3000;



//pass kastorsky1:6OqYebMEiYJwqe2G
console.log("Connecting to DB...");

// connect to db

const uri = "mongodb+srv://kastorsky1:6OqYebMEiYJwqe2G@simpleclickerdb.omxslcs.mongodb.net/simpleclickerdb";

async function initializeDatabase() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Успешное подключение к MongoDB!");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB", err);
  }
}
initializeDatabase()

async function addUser(username, firstName, wallet, score) {
  try {
    const user = new User({ username, firstName, wallet, score });
    await user.save();
    console.log('Добавлен пользователь:', user);
  } catch (err) {
    console.error('Ошибка добавления пользователя', err);
  }
}


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

    // add to db
    // const newUser = new User({ id: req.body.id, 
    //                         username: req.body.username, 
    //                         firstName: req.body.firstName, 
    //                         wallet: req.body.lastName, 
    //                         score: 155 });
    addUser(req.body.id, req.body.username, req.body.firstName, req.body.wallet, req.body.score);

    // newUser.save().then(() => console.log('User saved!'));
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});