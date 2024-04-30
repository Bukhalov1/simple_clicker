console.log("Express is here")



const express = require("express");
const app = express();
const PORT = 3000;

// Middleware для логирования IP-адресов
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`Access from IP: ${ip}`);
    next(); // Передаем управление следующему middleware
  });

app.use(express.static('public'));

app.get('/',(req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});