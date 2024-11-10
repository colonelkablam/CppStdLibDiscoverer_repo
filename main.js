// Display the number of symbols
document.getElementById("symbol-count").textContent = `Total symbols available: ${symbolCount}`;

// Function to display a random symbol link
function displayRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbolLinks.length);
    const randomSymbol = symbolLinks[randomIndex];
    const randomSymbolLink = document.getElementById("random-symbol-link");

    randomSymbolLink.href = randomSymbol.url;
    randomSymbolLink.textContent = `Learn about [ ${randomSymbol.name} ] in ${randomSymbol.namespace} namespace`;
    addToHistory(randomSymbol.name, randomSymbol.url, randomSymbol.namespace);
}

// Function to add symbol name and URL to history list
function addToHistory(symbolName, symbolUrl, symbolNamespace) {
    const historyList = document.getElementById("symbol-history");
    const listItem = document.createElement("li");

    // Create a link element for the symbol
    const link = document.createElement("a");
    link.textContent = `[ ${symbolName} ] in ${symbolNamespace} namespace`;
    link.href = symbolUrl;
    link.target = "_blank"; // Open in new tab
    link.rel = "noopener noreferrer"; // Security best practice when using target="_blank"


    listItem.appendChild(link);
    historyList.appendChild(listItem);
}

// Function to filter symbols based on search input
function filterSymbols() {
    const query = document.getElementById("search-box").value.toLowerCase();
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = ""; // Clear previous results
    resultsContainer.style.display = query ? "block" : "none"; // Show or hide dropdown based on input

    // Determine if search should be prefix-based or general match
    const matchingSymbols = symbolLinks.filter(symbol => {
        if (query.length < 3) {
            // Match symbols starting with the query
            return symbol.name.toLowerCase().startsWith(query);
        } else {
            // Match symbols containing the query
            return symbol.name.toLowerCase().includes(query);
        }
    });

    // Display matching symbols
    matchingSymbols.forEach(symbol => {
        const resultItem = document.createElement("p");
        resultItem.textContent = symbol.name;
        
        // Display the link in the designated area and clear search on click
        resultItem.onclick = () => {
            const selectedLink = document.getElementById("searched-symbol-link");
            selectedLink.href = symbol.url;
            selectedLink.textContent = `Learn about ${symbol.name}`;
            
            // Clear search box and hide results
            document.getElementById("search-box").value = "";
            resultsContainer.style.display = "none";

            // Add selected item to history
            addToHistory(symbol.name, symbol.url, symbol.namespace);
        };
        
        resultsContainer.appendChild(resultItem);
    });
}

// Hide dropdown and clear search when clicking outside the search area
document.addEventListener("click", (event) => {
    const searchBox = document.getElementById("search-box");
    const resultsContainer = document.getElementById("search-results");
    
    // Check if the click was outside the search box or dropdown
    if (!searchBox.contains(event.target) && !resultsContainer.contains(event.target)) {
        searchBox.value = ""; // Clear search box
        resultsContainer.style.display = "none"; // Hide dropdown
    }
});
