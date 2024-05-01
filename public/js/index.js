
// initialize btns
const profile = document.querySelector("#profile_btn");
const retry = document.querySelector("#retry_btn");
const leaderboard = document.querySelector("#leaderboard_btn");
const info = document.querySelector("#info_btn");
const display = document.querySelector("#display");
const button = document.querySelector("#button");
const counter = document.querySelector("#counter");

// open func on click
profile.onclick = () => {showPage("profile");}
// retry.onclick = () => {showPage("game");}
leaderboard.onclick = () => {showPage("leaderboard");}
info.onclick = () => {showPage("info");}
retry.onclick = () => prepare_to_start();

// game consts
const TIMEOUT = 5000;


// start here
prepare_to_start()
button.onclick = start;


// get user data
document.addEventListener('DOMContentLoaded', function() {
    if (window.Telegram.WebApp) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if(user.username){profile.textContent = user.username;}
        else{profile.textContent = `ID${user.id}`}
        
        if (user) {
            fetch('https://1362673-cj52870.tw1.ru/send-user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user.id,
                    username: user.username,
                    firstName: user.first_name,
                    wallet: "EQ---",
                    score: 100
                })
            })
            .then(response => response.text())
            // .then(result => alert('Данные успешно отправлены'))
            .catch(error => console.error('Error in transfer data, please contact us', error));
        }
    }
});

// hide and show page
function showPage(pageId) {
    // Скрываем все страницы
    const pages = document.querySelectorAll('.pages');
    pages.forEach(page => page.classList.add('hidden'));

    // Показываем нужную страницу
    const activePage = document.getElementById(pageId);
    activePage.classList.remove('hidden');
}

// first game window start
function prepare_to_start(){
    showPage("game");
    display.textContent = "Click as fast as you can";
    counter.textContent = ``;
    button.textContent = "Start";
    button.onclick = start;
}


// main clicker code
function start(){
    let clicks = 0; 
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