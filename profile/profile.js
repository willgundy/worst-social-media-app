import {
    checkAuth,
    logout,
    createProfile,
    getProfiles,
    getMyProfile,
    createMessage,
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
    const senderId = profileInfo.id;
    const recipientId = id;
    const messageContent = { sender_id: senderId, recipient_id: recipientId, text: message };

    await createMessage(messageContent);
});



logoutButton.addEventListener('click', () => {
    logout();
});
