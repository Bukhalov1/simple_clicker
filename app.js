console.log("app.js is started...")

const mongoose = require('mongoose');
const User = require('./User');

const express = require("express");
const app = express();
const PORT = 3000;



//pass kastorsky1:6OqYebMEiYJwqe2G
console.log("Connecting to DB...");

// connect to db
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://kastorsky1:6OqYebMEiYJwqe2G@simpleclickerdb.omxslcs.mongodb.net/simpleclickerdb";
const client = new MongoClient(uri, {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                            ssl: true,
                            tlsInsecure: true
                        });

async function addUser(username, firstName, wallet, score) {
  try {
    await client.connect();
    const db = client.db('simpleclickerdb');
    const collection = db.collection('users-data');
    const result = await collection.insertOne({ username, firstName, wallet, score, createdAt: new Date() });
    console.log(`Добавлен пользователь с id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

console.log("Connected to DB!");

console.log("\n\rTry to add user!\n\r")
addUser("kast", "alehx", 'Eq654651321sad', 10)
.catch("\r\nHERE IS ERROR:", console.error);




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
    //                         lastName: req.body.lastName, 
    //                         score: 155 });

    // newUser.save().then(() => console.log('User saved!'));
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});