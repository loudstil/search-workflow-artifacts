const core = require('@actions/core');
const github = require('@actions/github');

// Create Octokit instance outside functions
const octokit = github.getOctokit(core.getInput('token'));

async function run() {
    try {
        const artifactNameToSearch = core.getInput('artifact-name');
        const workflowName = core.getInput('workflow-name');

        const workflowsResponse = await octokit.rest.actions.listRepoWorkflows({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo
        });

        const workflow = workflowsResponse.data.workflows.find( w => w.name === workflowName);

        // Get the latest workflow runs for the specified workflow
        const response = await octokit.rest.actions.listWorkflowRuns({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            workflow_id: workflow.id,
            status: 'success',
            per_page: 5
        });

        // Iterate over the workflow runs
        for (const run of response.data.workflow_runs) {
            // Get artifacts for each run
            const artifactsResponse = await octokit.rest.actions.listWorkflowRunArtifacts({
                owner:  github.context.repo.owner,
                repo:  github.context.repo.repo,
                run_id: run.id,
            });

            // Check if the artifact is found in the current run
            const artifact = artifactsResponse.data.artifacts.find(a => a.name === artifactNameToSearch);

            if (artifact) {
                core.setOutput('art-id', artifact.id.toString());
                core.setOutput('run-id', run.id);
                return;
            }
        }
        // Artifact not found in any recent runs
        core.setFailed(`Artifact '${artifactNameToSearch}' not found in recent workflow runs.`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
