import { 
    checkAuth, 
    sendChat,
    client,
    getUser,
} from '../fetch-utils.js';

checkAuth();

const ChatsEl = document.querySelector('.chats');
const formEl = document.querySelector('form');

formEl.addEventListener('submit', async e => {
    e.preventDefault();

    const data = new FormData(formEl);

    await sendChat(data.get('message'));


    formEl.reset();
});


window.addEventListener('load', async () => {
    await client
    // hey, listen to the chats room
        .from('chats')
        // if a row is added, let me know and tell about that row
        .on('INSERT', (payload) => {
            const currentUser = getUser();
            
          
            const chatDiv = document.createElement('div');
            const chatMessageEl = document.createElement('p');
            const chatSenderEl = document.createElement('p');

            chatSenderEl.classList.add('sender');

            
            if (payload.new.sender_email === currentUser.email) {
                chatSenderEl.classList.add('is-me');
            }
            chatDiv.classList.add('chat-message');

            chatSenderEl.textContent = payload.new.sender_email;
            chatMessageEl.textContent = payload.new.text;

          
            chatDiv.append(chatMessageEl, chatSenderEl);
            ChatsEl.append(chatDiv);
        })
        .subscribe();

});
