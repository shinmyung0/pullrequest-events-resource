const stdin = require('get-stdin');

/**
 * This function simply parses STDIN to JSON
 */
async function getStdinAsJson() {
  var result;  
  try {
      result = JSON.parse(await stdin());
    } catch(error) {
      console.error("Error thrown during parsing stdin!")
      console.error(error)
    }
    return result
}

/**
 * Makes sure all required params are there
 * @param config raw JSON input
 */
function validateSourceConfig(configJson) {
    if (!configJson["source"]) {
      throw new Error("No 'source' key found, malformed json input!")
    }
  
    let requiredKeys = [
      "access_token",
      "owner",
      "repo"
    ];

    const validStates = ["MERGED", "CLOSED"]
  
    // make sure all the required keys are here
    for (let key of requiredKeys) {
      if (!configJson["source"][key]) {
        throw new Error(`Required parameter '${key}' not given!`)
      }
    }

    // if states is given, make sure it is a list
    // and that it only contains MERGED or CLOSED
    if (configJson["source"]["states"]) {
      let states = configJson["source"]["states"]
      if (!Array.isArray(states)) {
        throw new Error("source.states is not an array!")
      } else {
        for (let s of states) {
          if (!validStates.includes(s.toUpperCase())) {
            throw new Error("Unsupported PR state : " + s)
          }
        }
      }
    }
    
}
  
/**
 * Returns the raw source configuration
 */
async function getSourceConfig(configJson) {

    try {
      validateSourceConfig(configJson)

      // Default values for source config
      const sourceDefaults = {
        graphq_api: "https://api.github.com/graphql",
        base_branch: "master",
        first: 3,
        states: [
          "MERGED",
          "CLOSED"
        ]
      }
  
      mergedSourceConfig = {...sourceDefaults, ...configJson.source} 
      const capitalizedStates = mergedSourceConfig.states.map(x => x.toUpperCase() )
      mergedSourceConfig.states = capitalizedStates
      configJson.source = mergedSourceConfig

      return configJson
    } catch(err) {
      console.error("Error thrown during source config validation!")
      console.error(err)
    }
  
}



exports.getStdinAsJson = getStdinAsJson;
exports.getSourceConfig = getSourceConfig;