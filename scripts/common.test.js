const {
    getSourceConfig,
    convertToVersions
} = require("./common.js")

const fixtures = require("./fixtures.js")

// silence console.error
console.error = () => {}

test("Missing required source config throws error", () =>{
    const missingAccessToken = {
        "source": {
            "owner": "shinmyung0",
            "repo": "fixture-repo"
        }
    }

    const missingOwner = {
        "source": {
            "access_token": "some_token",
            "repo": "fixture-repo"
        }
    }

    const missingRepo = {
        "source": {
            "access_token": "some_token",
            "owner": "shinmyung0",
        }
    }

    expect(() => {
        getSourceConfig(missingAccessToken)
    }).toThrow()

    expect(() => {
        getSourceConfig(missingOwner)
    }).toThrow()

    expect(() => {
        getSourceConfig(missingRepo)
    }).toThrow()

})

test("Minimal source config is applied with defaults", () =>{
    const minimalSource = {
        "source": {
            "access_token": "some_token",
            "owner": "shinmyung0",
            "repo": "fixture-repo"
        }
    }

    const finalSource = getSourceConfig(minimalSource)

    expect(finalSource).toEqual({
        "source": {
            "graphql_api": "https://api.github.com/graphql",
            "access_token": "some_token",
            "base_branch": "master",
            "owner": "shinmyung0",
            "repo": "fixture-repo",
            "first": 3,
            "states": [
                "MERGED",
                "CLOSED"
            ]
        }
    })
})

test("Source config defaults are properly overridden", () => {
    const fullConfig = {
        "source": {
            "graphql_api": "https://api.github.com/graphql/custom",
            "access_token": "some_token",
            "base_branch": "some_branch",
            "owner": "some_owner",
            "repo": "some_repo",
            "first": 10,
            "states": [
                "MERGED"
            ]
        }
    }

    const resultConfig = getSourceConfig(fullConfig)
    expect(resultConfig).toEqual(
        {
            "source": {
                "graphql_api": "https://api.github.com/graphql/custom",
                "access_token": "some_token",
                "base_branch": "some_branch",
                "owner": "some_owner",
                "repo": "some_repo",
                "first": 10,
                "states": [
                    "MERGED"
                ]
            }
        }
    )
})


test("Non capitalized states are capitalized", () => {
    const fullConfig = {
        "source": {
            "graphql_api": "https://api.github.com/graphql/custom",
            "access_token": "some_token",
            "base_branch": "some_branch",
            "owner": "some_owner",
            "repo": "some_repo",
            "first": 10,
            "states": [
                "merged",
                "closed"
            ]
        }
    }
    const resultConfig = getSourceConfig(fullConfig)
    expect(resultConfig.source.states).toEqual([
        "MERGED",
        "CLOSED"
    ])
})

test("Non supported states throws exception", () => {
    const fullConfig = {
        "source": {
            "graphql_api": "https://api.github.com/graphql/custom",
            "access_token": "some_token",
            "base_branch": "some_branch",
            "owner": "some_owner",
            "repo": "some_repo",
            "first": 10,
            "states": [
                "unsupported state",
                "closed"
            ]
        }
    }
    expect(()=>{
        getSourceConfig(fullConfig)
    }).toThrow()
})


test("Array of PR objects are converted to versions properly", () => {
   
    const configWithNoVersion = {
        "source": {
            "graphql_api": "https://api.github.com/graphql/custom",
            "access_token": "some_token",
            "base_branch": "some_branch",
            "owner": "some_owner",
            "repo": "some_repo",
            "first": 10,
            "states": [
                "MERGED"
            ]
        }
    }

    const versions = convertToVersions(fixtures.expectedPRs, configWithNoVersion)
    expect(versions).toEqual(fixtures.expectedVersions)
    expect(versions.length).toBe(fixtures.expectedPRs.length)

})