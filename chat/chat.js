import {
  checkAuth,
  logout,
  sendChat,
  client,
  getUser,
} from '../fetch-utils.js';

const logoutButton = document.getElementById('logout');
const allChatsEl = document.getElementById('all-chats');
const formEl = document.querySelector('form');
//const currentUser = getUser();

checkAuth();

logoutButton.addEventListener('click', () => {
  logout();
});

formEl.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(formEl);

  await sendChat(data.get('message'));

  //await sendChat({
  //text: data.get('message'),
  //sender_email: currentUser.email,
  //user_id: currentUser.id
  //});

  formEl.reset();
});


window.addEventListener('load', async () => {
  await client
    .from('chats')
    .on('INSERT', payload => {
      const currentUser = getUser();
      const chatItemOuterEl = document.createElement('div');
      const chatSenderEl = document.createElement('p');
      const chatMessageEl = document.createElement('p');

      chatSenderEl.classList.add('sender');

      if (payload.new.sender_email === currentUser.email) {
        chatSenderEl.classList.add('is-me');
      }

      chatItemOuterEl.classList.add('chat-message');
      chatSenderEl.textContent = payload.new.sender_email;
      chatMessageEl.textContent = payload.new.text;
      chatItemOuterEl.append(chatMessageEl, chatSenderEl);
      allChatsEl.append(chatItemOuterEl);
    })
    .subscribe();
});