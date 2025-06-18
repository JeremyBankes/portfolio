/**
 * @param {PointerEvent} event 
 * @param {string} stayWithinElementId
 */
function showTooltip(event, stayWithinElementId) {
    const anchorElement = event.currentTarget;
    if (!(anchorElement instanceof HTMLElement)) {
        return;
    }
    const stayWithinElement = document.getElementById(stayWithinElementId);
    const stayWithinBounds = stayWithinElement.getBoundingClientRect();
    const tooltipElements = anchorElement.getElementsByClassName("tooltip");


    for (const tooltipElement of tooltipElements) {
        if (tooltipElement instanceof HTMLElement) {
            tooltipElement.classList.toggle("hidden", event.type === "mouseleave");
            const tooltipBounds = tooltipElement.getBoundingClientRect();
            const x = Math.min(event.clientX - tooltipBounds.width / 2, stayWithinBounds.right - tooltipBounds.width);
            const y = Math.max(event.clientY - tooltipBounds.height, stayWithinBounds.top);
            tooltipElement.style.left = `${x.toFixed(1)}px`;
            tooltipElement.style.top = `${y.toFixed(1)}px`;
        }
    }
}