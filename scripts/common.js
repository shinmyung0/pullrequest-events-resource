const stdin = require('get-stdin');

/**
 * This function simply parses STDIN to JSON
 */
async function getStdin() {
    let result = JSON.parse(await stdin());
    return result
}

/**
 * Makes sure all required params are there
 * @param config raw JSON input
 */
function validateSourceConfig(config) {
  
    if (!config["source"]) {
      throw new Error("No 'source' key found, malformed input!")
    }
  
  
    let requiredKeys = [
      "access_token",
      "owner",
      "repo"
    ];
  
    for (let key of requiredKeys) {
      if (!config["source"][key]) {
        throw new Error(`Required parameter '${key}' not given!`)
      }
    }
}
  
/**
 * Returns the raw source configuration
 */
async function getSourceConfig(rawConfig) {


    validateSourceConfig(rawConfig)

    finalConfig = {...sourceDefaults, ...rawConfig.source}

    return finalConfig

}


const sourceDefaults = {
    graphq_api: "https://api.github.com/graphql",
    base_branch: "master",
    first: 5
}

exports.getStdin = getStdin;
exports.getSourceConfig = getSourceConfig;
exports.sourceDefaults = sourceDefaults;