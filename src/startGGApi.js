const START_GG_API_URL = 'https://api.start.gg/gql/alpha';
const API_TOKEN = '14a2710f9d824b419546764d6813de84'; // Replace this with your real API token

/**
 * Sends a GraphQL query to start.gg
 * @param {string} query - GraphQL query string
 * @param {object} variables - Variables for the query
 * @returns {Promise<object>} - Parsed response data
 */
export async function fetchStartGGData(query, variables = {}) {
  const response = await fetch(START_GG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const json = await response.json();

  if (json.errors) {
    //console.error("Start.gg API Error:", json.errors);
    console.error("Start.gg API Error:", JSON.stringify(json.errors, null, 2));
    throw new Error("Failed to fetch start.gg data");
  }

  return json.data;
}

export async function getTop8Sets(tournamentSlug) {
    
    /*const query = `
    query GetTop8Sets($slug: String!) {
    tournament(slug: $slug) {
        name
        events {
          name
          sets(perPage: 8, page: 1) {
            nodes {
              fullRoundText
              slots {
                entrant {
                  name
                  participants {
                    gamerTag
                  }
                }
              }
            }
          }
        }
      }
    }`

    */
   const query = `
    query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
        event(id: $eventId) {
            id
            name
            sets(
                page: $page
                perPage: $perPage
                sortType: STANDARD
            )   {
                pageInfo {
                    total
                }
                nodes {
                    id
                    slots {
                        id
                        entrant {
                            id
                            name
                        }
                    }
                }
            }
        }
    },`

    const variables = { slug: tournamentSlug };
    /*

    const data = await fetchStartGGData(query, variables);

    return data.tournament.events[0].sets.nodes.map(set => ({
        partOfBracket: set.fullRoundText,
        player1Name: set.slots[0]?.entrant?.name || "Unknown",
        player2Name: set.slots[1]?.entrant?.name || "Unknown",
        character1: "SF6_Ryu", // Placeholder: map based on known player-character mapping
        character2: "SF6_Guile"
    }));
    */

    try {
        // Fetch data from the API
        const data = await fetchStartGGData(query, variables);
        
        // Log the response to check the data structure
        console.log('API Response:', data);
        
        // Check if the response is structured as expected
        if (!data || !data.tournament || !data.tournament.events || !data.tournament.events[0].sets.nodes) {
            throw new Error('Invalid API response structure');
        }

        // Map over the sets and return formatted data
        return data.tournament.events[0].sets.nodes.map(set => ({
            partOfBracket: set.fullRoundText || "Unknown", // Ensure this exists, fallback to "Unknown"
            player1Name: set.slots[0]?.entrant?.name || "Unknown", // Safely access player 1 name
            player2Name: set.slots[1]?.entrant?.name || "Unknown", // Safely access player 2 name
            character1: "SF6_Ryu", // Placeholder: map based on known player-character mapping
            character2: "SF6_Guile" // Placeholder: map based on known player-character mapping
        }));
    } catch (err) {
        // Log the error if something goes wrong
        console.error("Error in getTop8Sets:", err);
        throw err; // Re-throw the error so the calling function can handle it
    }
}

export async function getId(slug) {
    const query = `
    query getEventId($slug: String) {
        event(slug: $slug) {
            id
            name
        }
    },`
    const variables = { slug: slug };

    try {
        const data = await fetchStartGGData(query, variables);

        console.log('API Response, looking for event ID:', data);
        console.log('Event ID object:', data.event)
        return(data.event)
        
    } catch (err) {
        console.error("Error in getTop8Sets:", err);
        throw err; // Re-throw the error so the calling function can handle it
    }

}

export async function getSets(ID) {
    const query = `
    query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
        event(id: $eventId) {
            id
            name
            sets(
                page: $page
                perPage: $perPage
                sortType: STANDARD
            ) {
            pageInfo {
                total
                }
                nodes {
                    id
                    fullRoundText
                    slots {
                        id
                        entrant {
                            id
                            name
                        }
                    }
                }
            }
        }
    },`
    const variables = { eventId: ID, page: 1, perPage: 128  };
    try {
        const data = await fetchStartGGData(query, variables);

        //console.log('API Response, looking for sets:', data);
        //console.log('Sets object:', data.event)
        //console.log('Sets:', data.event.sets.nodes)
        //return(data)
        return data.event.sets.nodes;
        
    } catch (err) {
        console.error("Error in getting sets:", err);
        throw err; // Re-throw the error so the calling function can handle it
    }

}

export async function getPhaseID(eventID) {
    const query = `
    query GetPhases($eventId: ID!) {
        event(id: $eventId) {
            id
            name
            phases {
                id
                name
                phaseGroups {
                    nodes {
                        id
                        displayIdentifier
                    }
                }
            }
        }
    }`

    const variables = { eventId: eventID};
    try {
        const data = await fetchStartGGData(query, variables);

        console.log('API Response, looking for phase ID:', data);
        //console.log('Sets object:', data.event)
        //console.log('Sets:', data.event.sets.nodes)
        //return(data)
        return data;
        
    } catch (err) {
        console.error("Error in getting phase ID:", err);
        throw err; // Re-throw the error so the calling function can handle it
    }
}


export async function getSetsByPhaseID(phaseID, page, perPage) {
    const query = `
    query PhaseSets($phaseId: ID!, $page: Int!, $perPage: Int!) {
        phase(id: $phaseId) {
            id
            name
            sets(
                page: $page
                perPage: $perPage
                sortType: STANDARD
            ){
                pageInfo {
                    total
                }
                nodes {
                    id
                    fullRoundText
                    slots {
                        id
                        entrant {
                            id
                            name
                        }
                    }
                    games {
                        selections {
                            selectionType
                            selectionValue
                            entrant {
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }`

    const variables = { phaseId: phaseID, page: page, perPage: perPage};
    try {
        const data = await fetchStartGGData(query, variables);

        console.log('API Response, looking top 8 sets:', data);
        //console.log('Sets object:', data.event)
        //console.log('Sets:', data.event.sets.nodes)
        //return(data)
        return data;
        
    } catch (err) {
        console.error("Error in getting phase ID:", err);
        throw err; // Re-throw the error so the calling function can handle it
    }
}




export function parseStartGGUrl(url) {
    try {
      const pattern = /start\.gg\/tournament\/([^/]+)\/event\/([^/]+)\/brackets\/(\d+)\/(\d+)/;
      const match = url.match(pattern);
  
      if (!match) {
        throw new Error("Invalid start.gg URL format.");
      }
  
      const [, tournamentSlug, eventSlug, bracketId, phaseGroupId] = match;
  
      return {
        tournamentSlug,
        eventSlug,
        bracketId,
        phaseGroupId
      };
    } catch (error) {
      console.error("Failed to parse start.gg URL:", error.message);
      return null;
    }
  }