console.log("app.js is started...")

const mongoose = require('mongoose');
const User = require('./User');

const express = require("express");
const app = express();
const PORT = 3000;


console.log("Connecting to DB...");

// connect to db
                    //pass kastorsky1:6OqYebMEiYJwqe2G
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
async function checkUserExistsById(body) {
    try {
        // Поиск пользователя по id
        const user = await User.findOne({ id: body.id });

        // Проверяем наличие пользователя
        if (user) {
            console.log(`Пользователь с id <${body.id}> найден:`, user);
            return 1
        } else {
            console.log(`Пользователь с id <${body.id}> не найден`);
            console.log('adding new player')
            addUser(body.id, body.username, body.firstName, body.wallet, 0);  // req.body.score
        }
    } catch (err) {
        console.error('Ошибка проверки наличия пользователя:', err);
    }
}

// Добавить пользовантеля
async function addUser(id, username, firstName, wallet, score) {
    try {
      const user = new User({ id, username, firstName, wallet, score });
      await user.save();
      console.log('Добавлен пользователь:', user);
    } catch (err) {
      console.error('Ошибка добавления пользователя', err);
    }
  }

// Обновление значения score у пользователя с конкретным id
async function updateUserScore(userId, newScore) {
    try {
        // Находим пользователя по id
        const user = await User.findOne({ id: userId });

        if (!user) {
            console.log(`Пользователь с id ${userId} не найден.`);
            return;
        }
    
        // Проверяем, больше ли новый счет текущего
        if (newScore > user.score) {
            // Обновляем значение score, если новое значение больше
            user.score = newScore;
            const updatedUser = await user.save(); // Сохраняем изменения
    
            console.log('Обновленный пользователь:', updatedUser);
        } else {
            console.log('Новый счет не больше текущего, обновление не выполнено.');
        }
        } catch (err) {
        console.error('Ошибка обновления пользователя:', err);
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

    checkUserExistsById(req.body);
});

// Обработка POST-запроса
app.post('/send-new-score', (req, res) => {
    console.log('Got user data:', req.body);
    res.status(200).json({ message: "Succses in getting user data", yourData: req.body });

    if(checkUserExistsById(req.body)){
        console.log("\n\rUpdating score..")
        updateUserScore(req.body.id, req.body.score);
    }
});

// Эндпоинт для получения пользователей, отсортированных по количеству очков
app.get('/users/sorted-by-score', async (req, res) => {
    try {
      // Сортировка пользователей по полю score в порядке убывания (-1)
      const users = await User.find().sort({ score: -1 });
      res.json(users);
    } catch (err) {
      console.error('Ошибка сортировки пользователей:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// manifest
// export const tonConnectOptions = {
//   manifestUrl: 'https://webcrafters.ru/tonconnect-manifest.json', 
//   walletSelection: {
//       include: [
//           'tonkeeper',
//           'tonhub',
//           'tonwallet',
//           // добавьте другие кошельки по мере необходимости
//       ]
//   }
// };


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});