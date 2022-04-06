import { 
    checkAuth, 
    client,
    getOnlinePlayers,
    getMyProfile,
    updatePlayer,
} from '../fetch-utils.js';

checkAuth();

let currentPlayer;

const allPlayersEl = document.querySelector('.all-players');

const buttonEl = document.querySelector('button');

buttonEl.addEventListener('click', async (e) => {
    console.log(e);
    currentPlayer.is_playing = !currentPlayer.is_playing;

    await updatePlayer(currentPlayer);

});

const STEP = 30;
const GAME_HEIGHT = 550;
const GAME_WIDTH = 750;

window.addEventListener('keydown', async (e) => {
    if (e.key === 'w') {
        currentPlayer.y_position -= STEP;


        if (currentPlayer.y_position < STEP) {
            currentPlayer.y_position = GAME_HEIGHT;
        }
    }
    if (e.key === 'd') {
        currentPlayer.x_position += STEP;


        if (currentPlayer.x_position > GAME_WIDTH) {
            currentPlayer.x_position = STEP;
        }
    }
    if (e.key === 's') { 
        currentPlayer.y_position += STEP;


        if (currentPlayer.y_position > GAME_HEIGHT) {
            currentPlayer.y_position = STEP;
        }
    }
    if (e.key === 'a') {
        currentPlayer.x_position -= STEP;


        if (currentPlayer.x_position < STEP) {
            currentPlayer.x_position = GAME_WIDTH;
        }
    }

    await updatePlayer(currentPlayer);
});


window.addEventListener('load', async () => {
    currentPlayer = await getMyProfile();
    fetchAndDisplayActivePlayers();
    await client
    // hey, listen to the chats room
        .from('profiles')
        // if a row is added, let me know and tell about that row
        .on('UPDATE', (payload) => { 
            fetchAndDisplayActivePlayers();
        })
        .subscribe();

});



async function fetchAndDisplayActivePlayers() {
    const activePlayers = await getOnlinePlayers();

    allPlayersEl.textContent = '';
    for (let player of activePlayers) {

        const playerEl = document.createElement('div');
        playerEl.textContent = `😋 ${player.email}`;
        playerEl.classList.add('player');
        playerEl.style.transform = `translate(${player.x_position}px, ${player.y_position}px)`;


        allPlayersEl.append(playerEl);

    }
}

