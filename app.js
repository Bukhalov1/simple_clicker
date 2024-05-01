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

// Функция для проверки наличия пользователя по id
async function checkUserExistsById(userId) {
    try {
        // Поиск пользователя по id
        const user = await User.findOne({ id: userId });

        // Проверяем наличие пользователя
        if (user) {
            console.log(`Пользователь с id ${userId} найден:`, user);
            return 1
        } else {
            console.log(`Пользователь с id ${userId} не найден`);
            return 0
        }
    } catch (err) {
        console.error('Ошибка проверки наличия пользователя:', err);
    }
}

// Обновление значения score у пользователя с конкретным id
async function updateUserScore(userId, newScore) {
    try {
      // Опция `new: true` возвращает обновленный документ
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },           // Условие поиска по id
        { score: newScore },      // Обновляемое значение
        { new: true }             // Опция для возврата обновленного документа
      );
      
      if (updatedUser) {
        console.log('Обновленный пользователь:', updatedUser);
      } else {
        console.log(`Пользователь с id ${userId} не найден.`);
      }
    } catch (err) {
      console.error('Ошибка обновления пользователя:', err);
    }
  }

async function addUser(id, username, firstName, wallet, score) {
  try {
    const user = new User({ id, username, firstName, wallet, score });
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

    if(checkUserExistsById(req.body.id) == 0){
        // add new user to db
        addUser(req.body.id, req.body.username, req.body.firstName, req.body.wallet, 0);  // req.body.score
    }
});

// Обработка POST-запроса
app.post('/send-new-score', (req, res) => {
    console.log('Got user data:', req.body);
    res.status(200).json({ message: "Succses in getting user data", yourData: req.body });

    if(checkUserExistsById(req.body.id)){
        updateUserScore(req.body.id, req.body.score);
    }
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});