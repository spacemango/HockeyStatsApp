// API Links
//GET https://statsapi.web.nhl.com/api/v1/teams
//Returns a list of data about all teams including their id, venue details, division, conference and franchise information.

// GET https://statsapi.web.nhl.com/api/v1/teams/ID
// Returns the same information as above just for a single team instead of the entire league.

//GET https://statsapi.web.nhl.com/api/v1/teams/ID/roster
// Returns entire roster for a team including id value, name, jersey number and position details.

// GET https://statsapi.web.nhl.com/api/v1/people/ID
// Gets details for a player, must specify the id value in order to return data.

// GET https://statsapi.web.nhl.com/api/v1/statTypes
// Returns all the stats types to be used in order do get a specific kind of player stats

// https://gitlab.com/dword4/nhlapi


// Fetch function
export const getJSON = async function (url) {
   try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(`${data.message} (${res.status})`);

      return data;
   } catch (err) {
      messageError(err);
      throw err;
   }
};

// Display error message
export const messageError = function (msg) {
   document.querySelector('.spinner').style.display = 'none';
   document.querySelector('.message').innerHTML = '';
   document.querySelector('.message').innerHTML = `Sorry there was a problem!<br>
   ${msg}`;
};