export const fetchTournamentData = async (tournamentId) => {
    const query = `
      {
        tournament(id: "${tournamentId}") {
          id
          name
          startDate
          endDate
          description
          event {
            id
            name
            startDate
          }
        }
      }
    `;
  
    const apiKey = '14a2710f9d824b419546764d6813de84';; // Replace this with your start.gg API key
    const url = 'https://api.start.gg/gql/alpha';
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ query }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('API request failed');
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Handle the tournament data
      if (data.data && data.data.tournament) {
        console.log('Tournament Data:', data.data.tournament);
      } else {
        console.log('No tournament data found.');
      }
    } catch (error) {
      console.error('Error fetching data from start.gg API:', error);
    }
};

  
  // Call the function with a specific tournament ID (replace with a valid tournament ID)
  fetchTournamentData('2453122'); // Replace 'TOURNAMENT_ID' with an actual tournament ID