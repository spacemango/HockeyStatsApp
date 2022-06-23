import * as tables from './assets/js/tables.js';

const lastModified = document.querySelector("#last-modified");

// Date for last modified
const getDate = function () {
   const date = new Date();
   lastModified.innerHTML = `Last updated: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};


// Event listeners
// Team Stats
const teamsListener = function () {
   document.querySelector('#team-list').addEventListener('click', (e) => {
      e.preventDefault();
      tables.createStats(e.target.id);

   });
};

// Rookies
const rookiesListener = function () {
   document.querySelector('#rookies').addEventListener('click', (e) => {
      e.preventDefault();
      tables.createStats('rookies');
   });
};

const init = function () {
   getDate();
   tables.createTeamList();
   teamsListener();
   rookiesListener();
};

init();