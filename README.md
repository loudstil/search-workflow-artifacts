# Search Workflows Artifact

This actions is searching for a workflow where an artifact was created

## Inputs

### `artifact-name`

**Required** Name of the artifact to search for.

### `workflow-name`

**Required** Name of the workflow where the artifact was created.

### `token`

**Required** Authentication Token.

## Outputs

### `art-id`

ID of the found artifact.

### `run-id`

ID of the workflow run where the artifact was created.

## Example usage

```yaml
uses: actions/search-worflow-artifact
with:
  artifact-name: some-art
  workflow-name: create-artifact
  token: ${{ secrets.GITHUB_TOKEN }}
```
