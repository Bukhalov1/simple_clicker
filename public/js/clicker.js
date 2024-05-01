

// const display = document.querySelector("#display");
// const button = document.querySelector("#button");
// const counter = document.querySelector("#counter");
// const restart = document.querySelector("#retry_btn");


// prepare_to_start()

// function prepare_to_start(){
//     display.textContent = "Click as fast as you can";
//     counter.textContent = ``;
//     button.textContent = "Start";
//     button.onclick = start;
// }

// button.onclick = start;


// const TIMEOUT = 5000;

// function start(){
//     let clicks = 0; 
//     button.textContent = "Click";
//     counter.textContent = clicks;
//     const startTime = Date.now();

//     display.textContent = formatTime(TIMEOUT);

//     counter.textContent = ++clicks;
//     button.onclick = () => counter.textContent = ++clicks;

//     const interval = setInterval(() => {
//         const delta = Date.now() - startTime;
//         display.textContent = formatTime(TIMEOUT - delta);
//     }, 100);
    
//     const timeout = setTimeout(() => {
//         button.onclick = null;
//         display.textContent = "Game Over";
//         counter.textContent = `Your score is ${clicks}`;
//         button.textContent = "Try again!";
//         clearInterval(interval);
//         clearTimeout(timeout);
//     }, TIMEOUT);
// }


// restart.onclick = () => prepare_to_start(); // Переназначаем событие клика для новой игры

// function formatTime(ms){
//     return Number.parseFloat(ms / 1000).toFixed(2);
// }


