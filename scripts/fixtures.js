const expectedPRs = [
    {
      "cursor": "Y3Vyc29yOnYyOpK5MjAxOC0wMi0yNVQxMjozNDo0NC0wODowMM4KNQ/Z",
      "node": {
        "id": "MDExOlB1bGxSZXF1ZXN0MTcxMjQ5NjI1",
        "number": 1,
        "url": "https://github.com/shinmyung0/fixture-repo/pull/1",
        "baseRefName": "master",
        "headRefName": "test-merged-branch",
        "merged": true,
        "closed": true,
        "mergedAt": "2018-02-25T20:34:44Z",
        "closedAt": "2018-02-25T20:34:44Z"
      }
    },
    {
      "cursor": "Y3Vyc29yOnYyOpK5MjAxOC0wMi0yNVQxMjozNjoxNi0wODowMM4KNRBM",
      "node": {
        "id": "MDExOlB1bGxSZXF1ZXN0MTcxMjQ5NzQw",
        "number": 2,
        "url": "https://github.com/shinmyung0/fixture-repo/pull/2",
        "baseRefName": "master",
        "headRefName": "test-closed-branch",
        "merged": false,
        "closed": true,
        "mergedAt": null,
        "closedAt": "2018-02-25T20:36:16Z"
      }
    }
]

const mergedVersion = {
    "id": "MDExOlB1bGxSZXF1ZXN0MTcxMjQ5NjI1",
    "cursor": "Y3Vyc29yOnYyOpK5MjAxOC0wMi0yNVQxMjozNDo0NC0wODowMM4KNQ/Z",
    "number": "1",
    "url": "https://github.com/shinmyung0/fixture-repo/pull/1",
    "baseBranch": "master",
    "headBranch": "test-merged-branch",
    "state": "MERGED",
    "timestamp": "2018-02-25T20:34:44Z"
}

const closedVersion = {
    "id": "MDExOlB1bGxSZXF1ZXN0MTcxMjQ5NzQw",
    "cursor": "Y3Vyc29yOnYyOpK5MjAxOC0wMi0yNVQxMjozNjoxNi0wODowMM4KNRBM",
    "number": "2",
    "url": "https://github.com/shinmyung0/fixture-repo/pull/2",
    "baseBranch": "master",
    "headBranch": "test-closed-branch",
    "state": "CLOSED",
    "timestamp": "2018-02-25T20:36:16Z"
}

const latestVersion = closedVersion

const expectedVersions = [
    mergedVersion,
    closedVersion    
]

module.exports = {
    expectedPRs,
    expectedVersions,
    mergedVersion,
    closedVersion,
    latestVersion
}