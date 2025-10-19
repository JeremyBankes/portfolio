const OWNER = "JeremyBankes";
const REPOSITORY = "portfolio";
const WORKFLOW = "automatic-production-pull.yml";
const WORKFLOW_URL = new URL(`/repos/${OWNER}/${REPOSITORY}/actions/workflows/${WORKFLOW}/runs`, "https://api.github.com");
WORKFLOW_URL.searchParams.set("per_page", "1");
WORKFLOW_URL.searchParams.set("status", "success");

/**
 * Gets the last time the portfolio was updated. (By querying for GitHub's latest pipeline run.)
 * @returns {Promise<object|undefined>}
 */
async function getLastWorkflowRun() {
    try {
        const response = await fetch(WORKFLOW_URL);
        const lastWorkflowMetadata = await response.json();
        const [latestRun] = lastWorkflowMetadata.workflow_runs;
        return latestRun;
    } catch (error) {
        console.warn(`Failed to retrieve latest pipeline run from GitHub.`);
        console.warn(error);
        return undefined;
    }
}

addEventListener("DOMContentLoaded", async () => {
    const contentCard = document.getElementById("footer");
    const lastWorkflowRun = await getLastWorkflowRun();
    const lastUpdatedContainer = document.createElement("div");
    lastUpdatedContainer.classList.add("weight-smaller", "stack", "justify-end");
    const lastUpdatedSpan = document.createElement("span");
    lastUpdatedSpan.classList.add("text-align-end", "font-size-small", "foreground-color-accent");
    lastUpdatedSpan.textContent = `Last updated `;
    const lastUpdatedAnchor = document.createElement("a");
    const lastUpdatedRunUrl = new URL(`/${OWNER}/${REPOSITORY}/actions/workflows/${WORKFLOW}`, "https://github.com");
    lastUpdatedAnchor.href = lastUpdatedRunUrl.href;
    lastUpdatedAnchor.textContent = new Date(lastWorkflowRun.updated_at).toLocaleDateString("en-CA", { dateStyle: "long" });
    lastUpdatedAnchor.target = "_blank";
    lastUpdatedAnchor.classList.add("text-decoration-underline");
    lastUpdatedSpan.appendChild(lastUpdatedAnchor);
    lastUpdatedSpan.appendChild(document.createTextNode("."));
    lastUpdatedContainer.appendChild(lastUpdatedSpan);
    contentCard.appendChild(lastUpdatedContainer);
});