// Array to store the history of selected symbols
const symbolHistory = [];

function displayRandomSymbol() {
    // Pick a random symbol from the symbolLinks array
    const randomIndex = Math.floor(Math.random() * symbolLinks.length);
    const randomSymbol = symbolLinks[randomIndex];

    // Get the placeholder element for the current random symbol
    const symbolElement = document.getElementById("random-symbol");

    // Set the link with the symbol's name and URL
    symbolElement.innerHTML = `<a href="${randomSymbol.url}" target="_blank">${randomSymbol.name}</a>`;

    // Add the selected symbol to the history array
    symbolHistory.push(randomSymbol);

    // Update the history list
    updateHistoryList();
}

function updateHistoryList() {
    const historyList = document.getElementById("symbol-history");

    // Clear the list before re-rendering it
    historyList.innerHTML = "";

    // Populate the list with history items
    symbolHistory.forEach(symbol => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<a href="${symbol.url}" target="_blank">${symbol.name}</a>`;
        historyList.appendChild(listItem);
    });
}
