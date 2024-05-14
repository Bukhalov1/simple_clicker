import { TonConnectUI } from '@tonconnect/ui';
import { tonConnectOptions } from '..app.js';

document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-button');
    const tonConnectUIContainer = document.getElementById('ton-connect-ui');

    connectButton.addEventListener('click', () => {
        const tonConnectUI = new TonConnectUI(tonConnectOptions);
        tonConnectUI.render(tonConnectUIContainer);
    });
});
