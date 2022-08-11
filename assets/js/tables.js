import * as stats from './stats.js';
import { messageError } from './helper.js';

'use strict';

const container = document.querySelector('.container');
const teamParentElement = document.querySelector('#team-list');
const tableClasses = ['table', 'table-striped', 'table-sm', 'table-hover', 'table-bordered'];
const teamHeader = document.querySelector('#team-name');
const currentSeason = document.querySelector('#current-season');

// Capitalize heading
const capitalizeHeader = function (header) {
   return header[0].toUpperCase() + header.slice(1).toLowerCase();
};

// Creates and inserts table, table names, and table headers into DOM
const createTable = function (position) {

   let header = document.createElement('h5');
   header.textContent = capitalizeHeader(position);

   let table = document.createElement('table');
   table.classList.add(...tableClasses);
   table.setAttribute('id', `${position}-table`);
   let thead = document.createElement('thead');
   thead.setAttribute('id', `${position}-table-header`);

   container.insertAdjacentElement('beforeend', header);
   container.insertAdjacentElement('beforeend', table);

   table.insertAdjacentElement('beforeend', thead);
   thead.after(createBody(position));

   document.getElementById(`${position}-table-header`).innerHTML = createHeadings(position);
};

// Creates table headers
const createHeadings = function (position) {
   let heading = '<tr>';
   if (position === 'skaters') heading += createSkaterHeader();
   if (position === 'goalies') heading += createGoaliesHeader();
   heading += '</tr>';
   return heading;
};

// Creates column names of table headers for skaters
const createSkaterHeader = function () {
   const headings = ['#', 'Name', 'Age', 'POS', 'GP', 'G', 'A', 'Pts', '+/-', 'PIM'];
   return headings.map(heading => {
      return `<th>${heading}</th>`;
   }).join('');

};

// Creates column names of table headers for goalies
const createGoaliesHeader = function () {
   const headings = ['#', 'Name', 'Age', 'GP', 'GS', 'W', 'L', 'OTL', 'GAA', 'GA', 'SV', 'SA', 'SV%', 'SO'];
   return headings.map(heading => {
      return `<th>${heading}</th>`;
   }).join('');
};

// Inserts table body
const createBody = function (position) {
   let body = document.createElement('tbody');
   body.setAttribute('id', `${position}-body`);
   return body;
};

// Inserts page header
const createPageHeader = async function (id) {
   if (id === 'rookies') {
      teamHeader.innerHTML = `Rookie Statistics`;
      currentSeason.textContent = `(${stats.getCurrentSeason()})`;
   } else {
      const team = await stats.fetchSingleTeam(id);
      teamHeader.innerHTML = `${team[0].name.toUpperCase()}`;
      currentSeason.textContent = `Team Statistics (${stats.getCurrentSeason()})`;
   }
};

// Fetches team list and inserts into nav
const createTeamList = async function () {
   try {
      const teams = await stats.fetchTeams();
      const markup = teams
         .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
         .map(team =>
            `<li>
               <a href="" data-team-id="${team.id}">${team.name}</a>
            </li>`)
         .join('');

      teamParentElement.insertAdjacentHTML('afterbegin', markup);
   } catch (err) {
      messageError(err);
      throw err;
   }
};

// Creates and inserts skaters table
const createSkaters = async function (data) {
   createTable('skaters');
   const parentElement = document.querySelector('#skaters-body');
   let markupPlayers = '';

   data.forEach((player, i) => {
      markupPlayers = `
      <tr>
         <td>${i + 1}</td>
         <td>
            ${player.fullName}
            ${player.captain ? `(C)`
            : player.alternateCaptain ? `(A)`
               : ''}
         </td>
         <td>${player.currentAge}</td>
         <td>${player.primaryPosition.code}</td>
         <td>${player.stat.games}</td>
         <td>${player.stat.goals}</td>
         <td>${player.stat.assists}</td>
         <td class="stat-highlight">${player.stat.points}</td>
         <td>${player.stat.plusMinus}</td>
         <td>${player.stat.penaltyMinutes}</td>
      </tr>`;

      parentElement.innerHTML += markupPlayers;
   });
   document.querySelector('.spinner').style.display = 'none';
};

// Creates and inserts goalies table
const createGoalies = async function (data) {
   createTable('goalies');
   const parentElement = document.querySelector('#goalies-body');
   let markupPlayers = '';

   data.forEach((player, i) => {
      markupPlayers = `<tr>
      <td>${i + 1}</td>
      <td>${player.fullName}</td>
      <td>${player.currentAge}</td>
      <td>${player.stat.games}</td>
      <td>${player.stat.gamesStarted}</td>
      <td>${player.stat.wins}</td>
      <td>${player.stat.losses}</td>
      <td>${player.stat.ot}</td>
      <td>${(player.stat.goalAgainstAverage).toFixed(2)}</td>
      <td>${player.stat.goalsAgainst}</td>
      <td>${player.stat.saves}</td>
      <td>${player.stat.shotsAgainst}</td>
      <td class="stat-highlight">${(player.stat.savePercentage).toFixed(3)}</td>
      <td>${player.stat.shutouts}</td>
   </tr>`;
      parentElement.innerHTML += markupPlayers;
   });
};

// Create stats tables
const createStats = async function (id) {
   clearTables();
   let data = [];
   try {
      document.querySelector('.spinner').style.display = 'block';

      // Init page header
      createPageHeader(id);

      // Init which stats to display
      id === 'rookies'
         ? data = await stats.getRookieStats()
         : data = await stats.getTeamStats(id);

      createSkaters(data.skaters);
      createGoalies(data.goalies);
   } catch (err) {
      messageError(err);
      console.log(err);
   }
};

// Clear all tables
const clearTables = function () {
   container.innerHTML = '';
};

export { createTeamList, createStats };