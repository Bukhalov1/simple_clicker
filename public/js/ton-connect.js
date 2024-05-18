const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({                  // ТУТ БЫЛА ПРОБЛЕМА!!!!!
    manifestUrl: 'https://webcrafters.ru/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-ui'
});

// console.log(tonConnectUI);

// // tonConnectUI.render(tonConnectUIContainer);

// // Обработчик события подключения кошелька
// tonConnectUI.on('connect', (wallet) => {
//     const address = wallet.address;
//     console.log('Кошелек подключен, адрес:', address);

//     // Можете сохранить адрес в состоянии или показать пользователю
//     const addressContainer = document.createElement('div');
//     addressContainer.textContent = `Кошелек подключен: ${address}`;
//     document.body.appendChild(addressContainer);
// });

// // Обработчик события отключения кошелька
// tonConnectUI.on('disconnect', () => {
//     console.log('Кошелек отключен');

//     // Можете очистить состояние или уведомить пользователя
// });




