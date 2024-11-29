document.addEventListener("DOMContentLoaded", () => {
    const formatSelect = document.getElementById("format");
    const categorySelect = document.getElementById("category");
    const anyaText = document.getElementById("anya-text"); // Reference to Anya's dialogue text
    const searchInput = document.getElementById("anya-question");
    const searchResults = document.getElementById("search-results"); // Display search results

    const formats = {
        audio: ["mp3", "wav", "ogg", "aac"],
        image: ["png", "jpg", "jpeg", "bmp", "gif"],
        document: ["pdf", "docx", "txt", "html"]
    };

    // Update format options based on selected category
    categorySelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;

        // Update format dropdown options
        formatSelect.innerHTML = '<option value="">-- Select Format --</option>';
        if (formats[selectedCategory]) {
            formats[selectedCategory].forEach(format => {
                const option = document.createElement("option");
                option.value = format;
                option.textContent = format.toUpperCase();
                formatSelect.appendChild(option);
            });
        }

        // Update Anya's dialogue based on the selected category
        if (selectedCategory === "audio") {
            updateAnyaText("Time for some sound magic! 🎵");
        } else if (selectedCategory === "image") {
            updateAnyaText("Let's work on some beautiful pictures! 🖼️");
        } else if (selectedCategory === "document") {
            updateAnyaText("Handling your documents like a pro! 📄");
        } else {
            updateAnyaText("Hi there! Let's convert your files.");
        }
    });

    formatSelect.addEventListener("change", function () {
        const selectedFormat = formatSelect.value;
        if (selectedFormat) {
            updateAnyaText(`Great! You've selected ${selectedFormat.toUpperCase()} format. 🚀`);
        }
    });

    // Listen for "Ask Anya" button click
    document.getElementById("ask-anya-btn").addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            // Update Anya's dialogue with user input
            updateAnyaText(`Let me find some information on "${query}" for you! 🔍`);

            // Perform a web search (dummy API call or logic for now)
            searchWeb(query);
        } else {
            updateAnyaText("Please ask a question, and I'll help you find some information! 😊");
        }
    });

    // Perform web search and display results
    async function searchWeb(query) {
        const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;

        try {
            const response = await fetch(searchUrl);
            const data = await response.json();

            // Clear previous results
            searchResults.innerHTML = '';

            if (data.AbstractText) {
                // Display the abstract text (main answer)
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");
                resultItem.textContent = data.AbstractText || "No detailed answer available.";
                searchResults.appendChild(resultItem);
            } else {
                searchResults.innerHTML = "<div class='result-item'>No results found. Try refining your question.</div>";
            }
        } catch (error) {
            searchResults.innerHTML = "<div class='result-item'>Sorry, something went wrong. Please try again later.</div>";
        }
    }

    // Function to update Anya's dialogue
    function updateAnyaText(text) {
        anyaText.textContent = text; // Update Anya's dialogue text
    }
});

