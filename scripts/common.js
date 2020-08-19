const stdin = require('get-stdin');
const fetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const gql = require('graphql-tag');
const fs = require('fs')


/**
 * This function simply parses STDIN to JSON
 */
async function getStdinAsJson() {
  var result;  
  try {
      result = JSON.parse(await stdin());
    } catch(err) {
      console.error("Error thrown during parsing stdin!")
      throw err
    }
    return result
}

/**
 * Makes sure all required source config is there
 * @param configJson raw JSON input from stdin
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
 * Returns the raw source configuration merged
 * with any defaults
 * @param configJson json parsed stdin
 */
function getSourceConfig(configJson) {

    try {
      // check the .source key for valid syntax
      validateSourceConfig(configJson)

      // Default values for .source config
      const sourceDefaults = {
        graphql_api: "https://api.github.com/graphql",
        base_branch: "master",
        last: 3,
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
      throw err
    }
  
}


/**
 * This function makes the graphql request to fetch the most recent 10 pull requests
 * That have been merged.
 * @param stdinConfig stdin parsed as json, passed in by the concourse runtime
 */
async function getMergedPullRequests(stdinConfig) {

  // use only the 
  let sourceConfig = stdinConfig.source


  // params necessary for request
  const graphqlApi = sourceConfig["graphql_api"]
  const accessToken = sourceConfig["access_token"]
  const baseBranch = sourceConfig["base_branch"]
  const owner = sourceConfig["owner"]
  const repo = sourceConfig["repo"]
  const last = sourceConfig["last"]
  const states = sourceConfig["states"]


  // if a version was passed in, set .cursor as after
  // to grab only the versions after the cursor
  let after = undefined;
  if (stdinConfig["version"]) {
    after = stdinConfig["version"].cursor
  }
  

  // setup the client
  const client = new ApolloClient({
    link: new HttpLink({
      uri: graphqlApi,
      fetch: fetch,
      headers: {
        authorization: "Bearer " + accessToken
      }
    }),
    cache: new InMemoryCache()
  });


  const closedPrQuery = gql`
    query RecentlyMergedOrClosedPullRequests(
      $owner: String!, 
      $repo: String!, 
      $baseBranch: String!, 
      $last: Int!,
      $after: String,
      $states: [PullRequestState!]!
    ) {
      repository(owner: $owner, name: $repo) {
        nameWithOwner
        url 
        pullRequests(
          last: $last,
          baseRefName: $baseBranch, 
          states: $states, 
          orderBy:{field:UPDATED_AT, direction:ASC},
          after: $after
        ) {
          edges {
            cursor
            node{
              id
              number
              url
              baseRefName
              headRefName
              merged
              closed
              mergedAt
              closedAt
              updatedAt
            }
          }
        }
      }
    }
  `;

  let resp = await client.query({
    query: closedPrQuery,
    variables: {
      owner,
      repo,
      baseBranch,
      last,
      after,
      states
    }
  });

  return resp.data.repository.pullRequests.edges

}



/**
 * Returns a list of versions given an array of pullrequestedge objects
 * @param pullRequests array of pull request objects returned from graphql query
 */
function convertToVersions(pullRequests, sourceConfig) {

  let versions = [];

  for (let pr of pullRequests) {

    // since this resource only checks MERGED or CLOSED
    // if it isn't merged, then it will be closed
    let finalState = pr.node.merged ? 'MERGED' : 'CLOSED'

    versions.push({
      id: pr.node.id,
      cursor: pr.cursor,
      number: pr.node.number.toString(),
      url: pr.node.url,
      baseBranch: pr.node.baseRefName,
      headBranch: pr.node.headRefName,
      Updatedtime: pr.node.UpdatedAt,
      state: finalState,
      // if merged or closed will have either of these timestamps
      // merged prs have both merged and closed
      timestamp: pr.node.mergedAt || pr.node.closedAt
    })
  }

  // if a version was given, concat the resulting versions
  // as per concourse resource spec, given version should be
  // at the top. If no versions, then will be list containing
  // initial version
  if (sourceConfig.version) {
    versions = [sourceConfig.version].concat(versions)
  }

  return versions
}


function outputVersionToFile(targetDir, version, filename="pull_request") {
  let jsonOutput = JSON.stringify(version)
  fs.writeFileSync(targetDir + filename, jsonOutput)
}

exports.getStdinAsJson = getStdinAsJson;
exports.getSourceConfig = getSourceConfig;
exports.getMergedPullRequests = getMergedPullRequests;
exports.convertToVersions = convertToVersions;
exports.outputVersionToFile = outputVersionToFile;
