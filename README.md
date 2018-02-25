# pullrequest-events-resource

# Source Configuration

```yaml
resource_types:
- name: pull-request-events
  type: docker-image
  source:
    repository: shinmyung0/pullrequest-events-resource
    tag: latest


resources:
- name: github-pr-events
  type: pull-request-events
  source:
    access_token: ((github-access-token))
    graphql_api: ((github-v4-api))
    owner: ((repo-owner))
    repo: ((app-name))
    base_branch: master
```


# Behavior

- `check`: check for recently merged or closed pull requests

- `in`: get information about the recently closed pull requests which will be output as `$output_dir/pull_request` JSON file.

- `out`: noop