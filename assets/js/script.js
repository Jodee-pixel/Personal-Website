document.addEventListener("DOMContentLoaded", () => {
    setupThemeToggle();
    setupLiveDate();
    setupHobbyFilter();
    setupFaq();
    setupMessagePreview();
});

// Feature 1: switch the complete page between light and dark themes.
function setupThemeToggle() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "theme-toggle";
    toggleButton.setAttribute("aria-pressed", "false");

    const savedTheme = localStorage.getItem("janae-theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleButton.setAttribute("aria-pressed", "true");
        toggleButton.textContent = "Light mode";
    } else {
        toggleButton.textContent = "Dark mode";
    }

    toggleButton.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        toggleButton.setAttribute("aria-pressed", String(isDark));
        toggleButton.textContent = isDark ? "Light mode" : "Dark mode";
        localStorage.setItem("janae-theme", isDark ? "dark" : "light");
    });

    header.appendChild(toggleButton);
}

// Feature 2: display and update the visitor's local date and time.
function setupLiveDate() {
    const dateElement = document.createElement("p");
    dateElement.className = "live-date";
    dateElement.setAttribute("aria-live", "polite");
    document.querySelector("main")?.before(dateElement);

    function updateLiveDate() {
        const now = new Date();
        dateElement.textContent = now.toLocaleString([], {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    updateLiveDate();
    window.setInterval(updateLiveDate, 1000);
}

// Feature 3: filter the portfolio cards using text entered by the visitor.
function setupHobbyFilter() {
    const searchInput = document.getElementById("hobby-search");
    const hobbyCards = Array.from(document.querySelectorAll(".interest-card"));
    const resultCount = document.getElementById("hobby-result-count");
    if (!searchInput || hobbyCards.length === 0 || !resultCount) return;

    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        hobbyCards.forEach((card) => {
            const matches = card.textContent.toLowerCase().includes(searchText);
            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "hobby" : "hobbies"} shown`;
    });
}

// Feature 4: expand or collapse FAQ answers with accessible state updates.
function setupFaq() {
    document.querySelectorAll(".faq-question").forEach((question) => {
        question.addEventListener("click", () => {
            const answerId = question.getAttribute("aria-controls");
            const answer = answerId ? document.getElementById(answerId) : null;
            if (!answer) return;

            const isExpanded = question.getAttribute("aria-expanded") === "true";
            question.setAttribute("aria-expanded", String(!isExpanded));
            answer.hidden = isExpanded;
            question.querySelector("span").textContent = isExpanded ? "+" : "-";
        });
    });
}

// Feature 5: process form values and character input, then create a message preview.
function setupMessagePreview() {
    const form = document.getElementById("message-form");
    const messageInput = document.getElementById("visitor-message");
    const characterCount = document.getElementById("character-count");
    const preview = document.getElementById("message-preview");
    if (!form || !messageInput || !characterCount || !preview) return;

    messageInput.addEventListener("input", () => {
        const remaining = 300 - messageInput.value.length;
        characterCount.textContent = `${remaining} ${remaining === 1 ? "character" : "characters"} remaining`;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const name = String(formData.get("name")).trim();
        const email = String(formData.get("email")).trim();
        const message = String(formData.get("message")).trim();

        preview.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = `Message from ${name}`;

        const emailLine = document.createElement("p");
        emailLine.textContent = `Reply to: ${email}`;

        const messageLine = document.createElement("p");
        messageLine.textContent = message;

        preview.append(heading, emailLine, messageLine);
        preview.hidden = false;
    });
}
