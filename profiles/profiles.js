import {
    checkAuth,
    logout,
    getProfiles
} from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const profileContainerEl = document.getElementById('profile-container');
const sortParameter = document.getElementById('sort-param');
const ascdescSelect = document.getElementById('sort-asc-desc');

window.addEventListener('load', displayProfiles);
sortParameter.addEventListener('change', displayProfiles);
ascdescSelect.addEventListener('change', displayProfiles);


logoutButton.addEventListener('click', () => {
    logout();
});


async function displayProfiles() {
    const ascending = ascdescSelect.value === 'asc' ? true : false;

    const profiles = await getProfiles(sortParameter.value, ascending);

    profileContainerEl.textContent = '';

    for (let profile of profiles) {
        const profileEl = document.createElement('div');
        const linkEl = document.createElement('a');
        profileEl.classList.add('profile');
      

        linkEl.textContent = `${profile.email} has ${profile.karma} karma`;

        linkEl.href = `../profile/?id=${profile.id}`;

        profileEl.append(linkEl);
        profileContainerEl.append(profileEl);

    }
}