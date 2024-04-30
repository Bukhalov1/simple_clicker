const TelegramBot = require('node-telegram-bot-api');
const token = '6828993958:AAG1JU-tILY-kMt5UNxLFEhKaUZ5CM_NlhY';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    const userId = msg.from.id; // ID пользователя
    const username = msg.from.username ? `@${msg.from.username}` : 'Nan'; // Имя пользователя (никнейм) если есть
    const firstName = msg.from.first_name || 'Nan'; // Имя пользователя

    const response = `Your ID: ${userId}\nUser: ${username}\nName: ${firstName}`;
    bot.sendMessage(msg.chat.id, response);
});