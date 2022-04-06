import {
  checkAuth,
  logout,
  getMyProfile,
  createMessage,
  getMessages,
  getProfile,
  decrementKarma,
  incrementKarma,
  imageUpload,
  updateProfileImage,
  client,
} from '../fetch-utils.js';

const logoutButton = document.getElementById('logout');
const form = document.querySelector('form');
const messageContainer = document.querySelector('.messages');
const addButton = document.querySelector('.addButton');
const decrementButton = document.querySelector('.decrementButton');
const karmaHeaderEl = document.querySelector('.karma-class');
const imageInput = document.querySelector('#profileImage');
const profileName = document.querySelector('#profileName');
const profileAvatar = document.querySelector('#profileAvatar');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

imageInput.addEventListener('change', async (e) => {
  const imageFile = e.target.files[0];

  const filePath = `public/${imageFile.name}.jpg`;

  const tablePath = 'https://afgbmdkvqbvliaergujk.supabase.co/storage/v1/object/public/profile-images/' + filePath;

  await imageUpload(filePath, imageFile);

  updateProfileImage(id, tablePath);

  profileAvatar.src = tablePath;
});

checkAuth();

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = new FormData(form);
  const message = data.get('message');

  const profileInfo = await getMyProfile();
  const senderId = profileInfo.id;
  const recipientId = id;
  const messageContent = { sender_id: senderId, recipient_id: recipientId, text: message };

  await createMessage(messageContent);

  form.reset();
});

window.addEventListener('load', async () => {
  fetchAndDisplayProfile();
});

window.addEventListener('load', async () => {
  await client
    .from('*')
    .on('*', payload => {
      if (payload.eventType === 'INSERT') {
        renderMessages();
      }
    })
    .subscribe();
});

function shortDate (date) {
  var dateFormat = new Date(date);

  return dateFormat.toLocaleString('en-US');

  // (dateFormat.getMonth() + 1) + 
  // '/' + dateFormat.getDate() + '/' + dateFormat.getFullYear() + '' + dateFormat.getHours() + ':' + dateFormat.getMinutes();
}

async function fetchAndDisplayProfile (profile) {
  //karma header on profile
  renderKarma(profile);

  //create messages for profile
  renderMessages();
}

async function renderMessages () {
  messageContainer.innerHTML = '';

  const displayMessages = await getMessages(id);

  for (let message of displayMessages) {
    const messageDiv = document.createElement('p');
    messageDiv.classList.add('messagetext');


    const shortDateText = shortDate(message.created_at);


    messageDiv.textContent = `${message.text} from ${message.profiles.email} (${message.profiles.karma}) at ${shortDateText} `;

    messageContainer.append(messageDiv);
  }
}


async function renderKarma (profile) {
  const { email, karma, avatar } = profile ? profile : await getProfile(id);
  karmaHeaderEl.textContent = `Karma for ${email} is ${karma}`;

  profileName.textContent = email;
  profileAvatar.src = avatar;
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

