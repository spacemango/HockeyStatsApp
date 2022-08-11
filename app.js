import * as tables from './assets/js/tables.js';

const lastModified = document.querySelector("#last-modified");
const navItem = document.querySelector('#nav-item');

// Date for last modified
// TODO: Need a fix for dynamically generated page
const getDate = function () {
   const date = new Date();
   lastModified.innerHTML = `Last updated: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Event listeners
// Team Stats
const teamsListener = function () {
   document.querySelector('#team-list').addEventListener('click', (e) => {
      e.preventDefault();

      const { teamId } = e.target.dataset;
      tables.createStats(+teamId);
   });
};

// Rookies
const rookiesListener = function () {
   navItem.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.id === 'rookies') {
         tables.createStats('rookies');
      }
   });
};

const init = function () {
   tables.createTeamList();
   teamsListener();
   rookiesListener();
};

init();