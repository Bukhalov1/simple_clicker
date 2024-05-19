
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({                  // ТУТ БЫЛА ПРОБЛЕМА!!!!!
    manifestUrl: 'https://webcrafters.ru/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-ui'
});

const tonweb = new TonWeb();
const { Address } = tonweb;

// user-friendly address
function convertAddress(internalAddress) {
    const address = new Address(internalAddress);
    const friendlyAddress = address.toString(true, true, false); // true, true, false - UQ; true, true, true - EQ
    return friendlyAddress;
}

// Функция для получения баланса по адресу
async function getBalance(address) {
    try {
        const balance = await tonweb.provider.getBalance(address);
        // Баланс возвращается в нано-TON, поэтому делим на 1e9, чтобы получить TON
        const balanceInTON = balance / 1e9;
        return balanceInTON.toFixed(2);
    } catch (error) {
        console.error(`Error in getting balance: ${error}`);
        throw error;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('profile_btn');
    connectButton.addEventListener('click', () => {
        const internalAddress = tonConnectUI.wallet.account.address;
        const friendlyAddress = convertAddress(internalAddress);
        console.log('Wallet connected, friendlyAddress:', friendlyAddress);
        console.log('Wallet connected, internalAddress:', internalAddress);
        // const addressContainer = document.getElementById('your-address');
        // addressContainer.textContent = friendlyAddress;

        getBalance(friendlyAddress).then(balance => {
            console.log(`Balance: ${balance} TON`);
            const balanceContainer = document.getElementById('ton-balance');
            balanceContainer.textContent = `${balance} TON`;
        }).catch(error => {
            console.error(error);
        });
    });
});




