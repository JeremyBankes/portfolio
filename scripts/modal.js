
/**
 * @param {HTMLElement} element 
 */
function showModal(element) {
    const modalContainer = document.getElementById("modalContainer");
    modalContainer.classList.toggle("hidden", false);
    const modalContentElement = modalContainer.querySelector(".content");
    const templateContent = element.querySelector(".modal-content").cloneNode(true);
    templateContent.classList.remove("hidden");
    modalContentElement.replaceChildren(templateContent);
}

window.addEventListener("DOMContentLoaded", () => {
    const modalContainer = document.getElementById("modalContainer");
    const closeButton = modalContainer.querySelector(".close-button");
    modalContainer.addEventListener("click", (event) => {
        if (event.target === modalContainer || closeButton.contains(event.target)) {
            modalContainer.classList.toggle("hidden", true);
        }
    });

    document.querySelectorAll(".icon[onclick] svg").forEach(icon => {
        icon.style.animationDelay = `${-Math.random() * 5}s`;
    });
});