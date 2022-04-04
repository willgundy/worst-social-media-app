import {
  checkAuth,
  logout,
  createProfile,
  getProfiles
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const profileContainerEl = document.getElementById('profile-container');

window.addEventListener('load' async () => {

  const profiles = await getProfiles();
  profileContainerEl.textContent = '';

  for (let profile of profiles) {
    const profileEl = document.createElement('div');
    const linkEl = document.createElement('a');

    linkEl.textContent = `${profile.email} has ${profile.karma} karma`

    linkEl.href = `../profile/?id=${profile.id}`

    profileEl.append(linkEl);
    profileContainerEl.append(profileEl);

  }

});


logoutButton.addEventListener('click', () => {
  logout();
});
