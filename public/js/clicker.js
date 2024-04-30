

let clicks = 0;

const TIMEOUT = 5000;

const display = document.querySelector("#display");
const button = document.querySelector("#button");
const counter = document.querySelector("#counter");
const profile = document.querySelector("#profile");
const retry = document.querySelector("#retry");
const leaderboard = document.querySelector("#leaderboard");
const info = document.querySelector("#info");

button.onclick = start;
retry.onclick = retry_func;
leaderboard.onclick = leaderboard_func;
info.onclick = info_func;
profile.onclick = profile_func;

function start(){
    button.textContent = "Click";
    counter.textContent = clicks;
    const startTime = Date.now();

    display.textContent = formatTime(TIMEOUT);

    counter.textContent = ++clicks;
    button.onclick = () => counter.textContent = ++clicks;

    const interval = setInterval(() => {
        const delta = Date.now() - startTime;
        display.textContent = formatTime(TIMEOUT - delta);
    }, 100);
    
    const timeout = setTimeout(() => {
        button.onclick = null;
        display.textContent = "Game Over";
        counter.textContent = `Your score is ${clicks}`;
        button.textContent = "Try again!";
        clearInterval(interval);
        clearTimeout(timeout);
    }, TIMEOUT);
}

function formatTime(ms){
    return Number.parseFloat(ms / 1000).toFixed(2);
}

function retry_func(){
    console.log("retry_func");
}

function leaderboard_func(){
    console.log("leaderboard_func");
}

function info_func(){
    console.log("info_func");
}

function profile_func(){
    console.log("profile_func");
}
