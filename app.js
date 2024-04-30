console.log("app.js is started...")

const express = require("express");
const app = express();
const PORT = 3000;

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
app.post('/test', (req, res) => {
    console.log('Получены данные:', req.body);
    res.status(200).json({ message: "Данные успешно получены", yourData: req.body });
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});