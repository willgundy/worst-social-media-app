import {
    checkAuth,
    logout,
    createProfile,
    getProfiles,
    getMyProfile,
    createMessage,
    getMessages,
    getProfile,
    decrementKarma,
    incrementKarma
} from '../fetch-utils.js';

const logoutButton = document.getElementById('logout');
const form = document.querySelector('form');
const messageContainer = document.querySelector('.messages');
const addButton = document.querySelector('.addButton');
const decrementButton = document.querySelector('.decrementButton');
const karmaHeaderEl = document.querySelector('.karma-class');

checkAuth();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

form.addEventListener('submit', async e => {
    e.preventDefault();

    const data = new FormData(form);
    const message = data.get('message');

    const profileInfo = await getMyProfile();
    const profile = await getProfile(id);
    const senderId = profileInfo.id;
    const recipientId = id;
    const messageContent = { sender_id: senderId, recipient_id: recipientId, text: message };

    await createMessage(messageContent);

    form.reset();

    fetchAndDisplayProfile(profile);
});

window.addEventListener('load', async () => {
    fetchAndDisplayProfile();
});

async function fetchAndDisplayProfile(profile) {
    //karma header on profile
    const { email, karma } = profile ? profile : await getProfile(id);
    karmaHeaderEl.textContent = `Karma for ${email} is ${karma}`;

    //create messages for profile
    messageContainer.innerHTML = '';

    const displayMessages = await getMessages(id);

    for (let message of displayMessages) {
        const messageDiv = document.createElement('p');

        messageDiv.textContent = message.text;

        messageContainer.append(messageDiv);
    }
}



logoutButton.addEventListener('click', () => {
    logout();
});

decrementButton.addEventListener('click', async () => {
    const profile = await decrementKarma(id);

    fetchAndDisplayProfile(profile);
});

addButton.addEventListener('click', async () => {
    const profile = await incrementKarma(id);

    fetchAndDisplayProfile(profile);
});
