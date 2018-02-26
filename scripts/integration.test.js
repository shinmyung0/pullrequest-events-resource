const {
    getMergedPullRequests,
    convertToVersions
} = require("./common.js")

const fixtures = require("./fixtures.js")

test("Fetch latest MERGED/CLOSED PRs from earliest to latest", async ()=> {
    
    const accessToken = process.env["GH_ACCESS_TOKEN"]
    // $GH_ACCESS_TOKEN should be set for this test to run
    expect(accessToken).toBeDefined()
    
    var configObj = {
        "source": {
            "graphql_api": "https://api.github.com/graphql",
            "access_token": accessToken,
            "base_branch": "master",
            "owner": "shinmyung0",
            "repo": "fixture-repo",
            "first": 3,
            "states": [
                "CLOSED",
                "MERGED"
            ]
        }
    }

    const fetchedPRs = await getMergedPullRequests(configObj)
    const versions = convertToVersions(fetchedPRs, configObj)
    expect(versions).toEqual(fixtures.expectedVersions)
    expect(versions.length).toBe(2)
    const earlierTime = new Date(versions[0].timestamp)
    const laterTime = new Date(versions[1].timestamp)
    expect(earlierTime < laterTime).toBe(true)
})

test("Fetch only merged PRs", async () => {
    const accessToken = process.env["GH_ACCESS_TOKEN"]
    // $GH_ACCESS_TOKEN should be set for this test to run
    expect(accessToken).toBeDefined()
    

    const configObj = {
        "source": {
            "graphql_api": "https://api.github.com/graphql",
            "access_token": accessToken,
            "base_branch": "master",
            "owner": "shinmyung0",
            "repo": "fixture-repo",
            "first": 3,
            "states": [
                "MERGED"
            ]
        }
    }

    const fetchedPRs = await getMergedPullRequests(configObj)
    const versions = convertToVersions(fetchedPRs, configObj)
    expect(versions).toEqual([fixtures.mergedVersion])
    expect(versions.length).toBe(1)
    expect(versions[0].state).toBe("MERGED")
})

test("Fetch only closed PRs", async () => {
    const accessToken = process.env["GH_ACCESS_TOKEN"]
    // $GH_ACCESS_TOKEN should be set for this test to run
    expect(accessToken).toBeDefined()
    

    const configObj = {
        "source": {
            "graphql_api": "https://api.github.com/graphql",
            "access_token": accessToken,
            "base_branch": "master",
            "owner": "shinmyung0",
            "repo": "fixture-repo",
            "first": 3,
            "states": [
                "CLOSED"
            ]
        }
    }

    const fetchedPRs = await getMergedPullRequests(configObj)
    const versions = convertToVersions(fetchedPRs, configObj)
    expect(versions).toEqual([fixtures.closedVersion])
    expect(versions.length).toBe(1)
    expect(versions[0].state).toBe("CLOSED")
})

test("Given the latest PR event as version, should return just that version", async () => {
    const accessToken = process.env["GH_ACCESS_TOKEN"]
    // $GH_ACCESS_TOKEN should be set for this test to run
    expect(accessToken).toBeDefined()
    
    const configObj = {
        "source": {
            "graphql_api": "https://api.github.com/graphql",
            "access_token": accessToken,
            "base_branch": "master",
            "owner": "shinmyung0",
            "repo": "fixture-repo",
            "first": 3,
            "states": [
                "CLOSED"
            ]
        },
        version: fixtures.latestVersion
    }

    const fetchedPRs = await getMergedPullRequests(configObj)
    const versions = convertToVersions(fetchedPRs, configObj)

    expect(versions).toEqual([fixtures.latestVersion])
    expect(versions.length).toBe(1)
    expect(versions[0].id).toBe(fixtures.latestVersion.id)
})