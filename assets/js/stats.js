'use strict';

import { getJSON, messageError } from './helper.js';

const API_URL_TEAMS = 'https://statsapi.web.nhl.com/api/v1/teams';
const API_URL_PLAYER = 'https://statsapi.web.nhl.com/api/v1/people/';
const CURRENT_SEASON = '20222023';

// Returns stats from a single team
// @param - teamId from teamsListener() event listener
const fetchSingleTeam = async function (teamId) {
   try {
      const data = await getJSON(`${API_URL_TEAMS}/${teamId}`);
      return data.teams;
   } catch (err) {
      messageError(err);
   }
};

// Returns all teams
const fetchTeams = async function () {
   try {
      const data = await getJSON(API_URL_TEAMS);
      return data.teams;
   } catch (err) {
      messageError(err);
   }
};

// Returns roster IDs from a single team
// @param - teamId from teamsListener() event listener
const fetchPlayerId = async function (teamId) {
   try {
      const data = await getJSON(`https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster`);

      return data.roster.map(per => per.person.id);
   } catch (err) {
      messageError(err);
   }
};

// Returns player biography stats
// @param - playerId from fetchPlayerId()
const fetchPlayerStats = async function (playerId) {
   try {
      const data = await playerId;

      const playerRes = await Promise.all(
         data.map(async (id) =>
            await getJSON(`${API_URL_PLAYER}${id}`)));

      return playerRes.map(person => person.people[0]);
   } catch (err) {
      messageError(err);
      throw (err);
   }
};

// Returns current season stats for player
// player @param - player array from fetchPlayerStats
const fetchCurrentSeasonStats = async function (players) {
   try {
      const data = await players;

      const rosterStats = await Promise.all(
         data.map(async (player) => {
            const statsRes = await getJSON(`${API_URL_PLAYER}${player.id}/stats/?stats=statsSingleSeason&season=${CURRENT_SEASON}`);
            const stats = statsRes.stats[0];

            // Ignore players with no stats in current season
            // Merge player bio stats and season stats in an object
            if (stats.splits.length != 0 || stats.splits[0] !== undefined) {
               let playerStat = stats.splits[0];
               return { ...player, ...playerStat };
            }

         }));
      return rosterStats.filter(stat => stat !== undefined);
   } catch (err) {
      messageError(err);
      throw (err);
   }
};

// Default sorting of players by points for skaters, by save percentage for goalies
// @param - array of players
const sortPlayersDefault = async function (playerStats) {
   try {
      const stats = await playerStats;
      let skaters = stats
         .filter(player => player.primaryPosition.code !== 'G')
         .sort((a, b) => a.stat.games - b.stat.games)
         .sort((a, b) => b.stat.points - a.stat.points);

      let goalies = stats
         .filter(player => player.primaryPosition.code === 'G')
         .filter(player => player.stat.games > 0)
         .sort((a, b) => b.stat.games - a.stat.games)
         .sort((a, b) => b.stat.savePercentage - a.stat.savePercentage);

      return { skaters, goalies };
   } catch (err) {
      messageError(err);
      throw err;
   }
};

// Returns sorted team stats
// teamId - @param, team id to begin searching for players
const getTeamStats = async function (teamId) {
   const stats = await fetchCurrentSeasonStats(fetchPlayerStats(fetchPlayerId(teamId)));
   return sortPlayersDefault(stats);
};

// Returns sorted rookie stats
// Where player: {rookie: true}
const getRookieStats = async function () {
   const teams = await fetchTeams();

   // Get all players
   const playerRes = await Promise.all(
      teams.map(async (team) => await fetchPlayerStats(fetchPlayerId(team.id)))
   );

   // Merge all team arrays and filter rookies
   const rookies = playerRes
      .reduce((a, b) => a.concat(b), [])
      .filter(player => player.rookie);

   // Get current season stats for top 50 skaters and top 10 goalies
   const rookiesStats = await fetchCurrentSeasonStats(rookies);
   const rookiesSorted = await sortPlayersDefault(rookiesStats);

   let skaters = rookiesSorted.skaters.slice(0, 50);
   let goalies = rookiesSorted.goalies.slice(0, 10);

   return { skaters, goalies };
};

// Returns formatted string of current season
const getCurrentSeason = function () {
   return CURRENT_SEASON.slice(0, 4) + '-' + CURRENT_SEASON.substring(4);
};

export { getCurrentSeason, fetchSingleTeam, fetchTeams, getTeamStats, getRookieStats };