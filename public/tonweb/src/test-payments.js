// TonWeb is JavaScript SDK (Web and NodeJS) for TON

const TonWeb = require("./index");

// For calculations in the blockchain, we use BigNumber (BN.js). https://github.com/indutny/bn.js
// Don't use regular {Number} for coins, etc., it has not enough size and there will be loss of accuracy.

const BN = TonWeb.utils.BN;

// Blockchain does not operate with fractional numbers like `0.5`.
// `toNano` function converts TON to nanoton - smallest unit.
// 1 TON = 10^9 nanoton; 1 nanoton = 0.000000001 TON;
// So 0.5 TON is 500000000 nanoton

const toNano = TonWeb.utils.toNano;

const init = async () => {
    const providerUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC'; // TON HTTP API url. Use this url for testnet
    const apiKey = ''; // Obtain your API key in https://t.me/tontestnetapibot
    const tonweb = new TonWeb(new TonWeb.HttpProvider(providerUrl, {apiKey})); // Initialize TON SDK

    //----------------------------------------------------------------------
    // PARTIES
    // The payment channel is established between two participants A and B.
    // Each has own secret key, which he does not reveal to the other.

    // New secret key can be generated by `tonweb.utils.newSeed()`
    tonweb.utils.newSeed(); // Uint8Array

    const seedA = TonWeb.utils.base64ToBytes('vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY='); // A's private (secret) key
    const keyPairA = tonweb.utils.keyPairFromSeed(seedA); // Obtain key pair (public key and private key)

    const seedB = TonWeb.utils.base64ToBytes('at58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY='); // B's private (secret) key
    const keyPairB = tonweb.utils.keyPairFromSeed(seedB); // Obtain key pair (public key and private key)

    // if you are new to cryptography then the public key is like a login, and the private key is like a password.
    // Login can be shared with anyone, password cannot be shared with anyone.

    // With a key pair, you can create a wallet.
    // Note that this is just an object, we are not deploying anything to the blockchain yet.
    // Transfer some amount of test coins to this wallet address (from your wallet app).
    // To check you can use blockchain explorer https://testnet.tonscan.org/address/<WALLET_ADDRESS>

    const walletA = tonweb.wallet.create({
        publicKey: keyPairA.publicKey
    });
    const walletAddressA = await walletA.getAddress(); // address of this wallet in blockchain
    console.log('walletAddressA = ', walletAddressA.toString(true, true, true));

    const walletB = tonweb.wallet.create({
        publicKey: keyPairB.publicKey
    });
    const walletAddressB = await walletB.getAddress(); // address of this wallet in blockchain
    console.log('walletAddressB = ', walletAddressB.toString(true, true, true));

    //----------------------------------------------------------------------
    // PREPARE PAYMENT CHANNEL

    // The parties agree on the configuration of the payment channel.
    // They share information about the payment channel ID, their public keys, their wallet addresses for withdrawing coins, initial balances.
    // They share this information off-chain, for example via a websocket.

    const channelInitState = {
        balanceA: toNano('1'), // A's initial balance in Toncoins. Next A will need to make a top-up for this amount
        balanceB: toNano('2'), // B's initial balance in Toncoins. Next B will need to make a top-up for this amount
        seqnoA: new BN(0), // initially 0
        seqnoB: new BN(0)  // initially 0
    };

    const channelConfig = {
        channelId: new BN(124), // Channel ID, for each new channel there must be a new ID
        addressA: walletAddressA, // A's funds will be withdrawn to this wallet address after the channel is closed
        addressB: walletAddressB, // B's funds will be withdrawn to this wallet address after the channel is closed
        initBalanceA: channelInitState.balanceA,
        initBalanceB: channelInitState.balanceB
    }

    // Each on their side creates a payment channel object with this configuration

    const channelA = tonweb.payments.createChannel({
        ...channelConfig,
        isA: true,
        myKeyPair: keyPairA,
        hisPublicKey: keyPairB.publicKey,
    });
    const channelAddress = await channelA.getAddress(); // address of this payment channel smart-contract in blockchain
    console.log('channelAddress=', channelAddress.toString(true, true, true));

    const channelB = tonweb.payments.createChannel({
        ...channelConfig,
        isA: false,
        myKeyPair: keyPairB,
        hisPublicKey: keyPairA.publicKey,
    });

    if ((await channelB.getAddress()).toString() !== channelAddress.toString()) {
        throw new Error('Channels address not same');
    }

    // Interaction with the smart contract of the payment channel is carried out by sending messages from the wallet to it.
    // So let's create helpers for such sends.

    const fromWalletA = channelA.fromWallet({
        wallet: walletA,
        secretKey: keyPairA.secretKey
    });

    const fromWalletB = channelB.fromWallet({
        wallet: walletB,
        secretKey: keyPairB.secretKey
    });

    //----------------------------------------------------------------------
    // DEPLOY PAYMENT CHANNEL FROM WALLET A

    // Wallet A must have a balance.
    // 0.05 TON is the amount to execute this transaction on the blockchain. The unused portion will be returned.
    // After this action, a smart contract of our payment channel will be created in the blockchain.

    await fromWalletA.deploy().send(toNano('0.05'));

    // To check you can use blockchain explorer https://testnet.tonscan.org/address/<CHANNEL_ADDRESS>
    // We can also call get methods on the channel (it's free) to get its current data.

    console.log(await channelA.getChannelState());
    const data = await channelA.getData();
    console.log('balanceA = ', data.balanceA.toString())
    console.log('balanceB = ', data.balanceB.toString())


    // TOP UP

    // Now each parties must send their initial balance from the wallet to the channel contract.

    await fromWalletA
        .topUp({coinsA: channelInitState.balanceA, coinsB: new BN(0)})
        .send(channelInitState.balanceA.add(toNano('0.05'))); // +0.05 TON to network fees

    await fromWalletB
        .topUp({coinsA: new BN(0), coinsB: channelInitState.balanceB})
        .send(channelInitState.balanceB.add(toNano('0.05'))); // +0.05 TON to network fees

    // to check, call the get method - the balances should change

    // INIT

    // After everyone has done top-up, we can initialize the channel from any wallet

    await fromWalletA.init(channelInitState).send(toNano('0.05'));

    // to check, call the get method - `state` should change to `TonWeb.payments.PaymentChannel.STATE_OPEN`

    //----------------------------------------------------------------------
    // FIRST OFFCHAIN TRANSFER - A sends 0.1 TON to B

    // A creates new state - subtracts 0.1 from A's balance, adds 0.1 to B's balance, increases A's seqno by 1

    const channelState1 = {
        balanceA: toNano('0.9'),
        balanceB: toNano('2.1'),
        seqnoA: new BN(1),
        seqnoB: new BN(0)
    };

    // A signs this state and send signed state to B (e.g. via websocket)

    const signatureA1 = await channelA.signState(channelState1);

    // B checks that the state is changed according to the rules, signs this state, send signed state to A (e.g. via websocket)

    if (!(await channelB.verifyState(channelState1, signatureA1))) {
        throw new Error('Invalid A signature');
    }
    const signatureB1 = await channelB.signState(channelState1);

    //----------------------------------------------------------------------
    // SECOND OFFCHAIN TRANSFER - A sends 0.2 TON to B

    // A creates new state - subtracts 0.2 from A's balance, adds 0.2 to B's balance, increases A's seqno by 1

    const channelState2 = {
        balanceA: toNano('0.7'),
        balanceB: toNano('2.3'),
        seqnoA: new BN(2),
        seqnoB: new BN(0)
    };

    // A signs this state and send signed state to B (e.g. via websocket)

    const signatureA2 = await channelA.signState(channelState2);

    // B checks that the state is changed according to the rules, signs this state, send signed state to A (e.g. via websocket)

    if (!(await channelB.verifyState(channelState2, signatureA2))) {
        throw new Error('Invalid A signature');
    }
    const signatureB2 = await channelB.signState(channelState2);

    //----------------------------------------------------------------------
    // THIRD OFFCHAIN TRANSFER - B sends 1.1 TON TO A

    // B creates new state - subtracts 1.1 from B's balance, adds 1.1 to A's balance, increases B's seqno by 1

    const channelState3 = {
        balanceA: toNano('1.8'),
        balanceB: toNano('1.2'),
        seqnoA: new BN(2),
        seqnoB: new BN(1)
    };

    // B signs this state and send signed state to A (e.g. via websocket)

    const signatureB3 = await channelB.signState(channelState3);

    // A checks that the state is changed according to the rules, signs this state, send signed state to B (e.g. via websocket)

    if (!(await channelA.verifyState(channelState3, signatureB3))) {
        throw new Error('Invalid B signature');
    }
    const signatureA3 = await channelA.signState(channelState3);

    //----------------------------------------------------------------------
    // So they can do this endlessly.
    // Note that a party can make its transfers (from itself to another) asynchronously without waiting for the action of the other side.
    // Party must increase its seqno by 1 for each of its transfers and indicate the last seqno and balance of the other party that it knows.

    //----------------------------------------------------------------------
    // CLOSE PAYMENT CHANNEL

    // The parties decide to end the transfer session.
    // If one of the parties disagrees or is not available, then the payment channel can be emergency terminated using the last signed state.
    // That is why the parties send signed states to each other off-chain.
    // But in our case, they do it by mutual agreement.

    // First B signs closing message with last state, B sends it to A (e.g. via websocket)

    const signatureCloseB = await channelB.signClose(channelState3);

    // A verifies and signs this closing message and include B's signature

    // A sends closing message to blockchain, payments channel smart contract
    // Payment channel smart contract will send funds to participants according to the balances of the sent state.

    if (!(await channelA.verifyClose(channelState3, signatureCloseB))) {
        throw new Error('Invalid B signature');
    }

    await fromWalletA.close({
        ...channelState3,
        hisSignature: signatureCloseB
    }).send(toNano('0.05'));
}

init();