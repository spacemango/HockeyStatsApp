import * as tables from './assets/js/tables.js';

const navItem = document.querySelector('#nav-item');
const teamList = document.querySelector('#team-list');

// Event listeners
// Team Stats
const teamsListener = function () {
   teamList.addEventListener('click', (e) => {
      e.preventDefault();

      if (isNaN(e.target.dataset.teamId)) return;

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