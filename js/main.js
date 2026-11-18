const searchBox = document.querySelector(".search-box");
const searchInput = searchBox.querySelector("input");
let searchTimer;

searchBox.addEventListener("click", (event) => {
    if (!event.target.closest(".search-icon")) return;

    const isActive = searchInput.classList.toggle("active");

    if (isActive) {
        searchInput.focus();
    } else {
        searchInput.blur();
    }
});

function clearSearchHighlight() {
    document.querySelectorAll(".search-match").forEach((element) => {
        element.classList.remove("search-match");
    });
}

function searchAndScroll(value) {
    clearSearchHighlight();

    const searchWord = value.trim().toLowerCase();
    if (!searchWord) return;

    const selectors = "h1, h2, h3, h4, h5, h6, p, li, a, button, blockquote, span";
    const matches = [...document.querySelectorAll(selectors)].filter((element) => {
        return element.textContent.toLowerCase().includes(searchWord);
    });

    if (matches.length === 0) return;

    const match = matches.sort(
        (first, second) => first.textContent.trim().length - second.textContent.trim().length
    )[0];

    match.classList.add("search-match");
    match.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
}

searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => searchAndScroll(searchInput.value), 250);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        window.clearTimeout(searchTimer);
        searchAndScroll(searchInput.value);
    }

    if (event.key === "Escape") {
        searchInput.value = "";
        searchInput.blur();
        clearSearchHighlight();
    }
});
