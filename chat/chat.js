import {
  checkAuth,
  logout,
  sendChat,
  client,
} from '../fetch-utils.js';

const logoutButton = document.getElementById('logout');
const theChatsEl = document.querySelector('the-chats');
const formEl = document.querySelector('form');

checkAuth();

logoutButton.addEventListener('click', () => {
  logout();
});

formEl.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(formEl);

  await sendChat(data.get('message'))

  formEl.reset();
});


window.addEventListener('load', async () => {
  await client
    .from('chats')
    .on('INSERT', payload => {
      const chatItemOuterEl = document.createElement('div');
      const chatSenderEl = document.createElement('p');
      const chatMessageEl = document.createElement('p');

      chatItemOuterEl.classList.add('chat-message');
      chatSenderEl.classList.add('sender');
      chatSenderEl.textContent = payload.new.sender_email;
      chatMessageEl.textContent = payload.new.text;
      chatItemOuterEl.append(chatMessageEl, chatSenderEl);
      theChatsEl.append(chatItemOuterEl);
    });
    .subscribe()
});