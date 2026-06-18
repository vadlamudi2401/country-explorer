/**
 * Function to handle Back button redirection
 * Redirects to the index.html page by setting window.location.href
 */
function backButtonHandler() {
    window.location.href = "index.html";
}

/**
 * Executes automatically upon window loading initialization context
 */
document.addEventListener("DOMContentLoaded", () => {
    // Register backButtonHandler() function as an event handler to the Back button
    const backButton = document.getElementById("back-btn");
    if (backButton) {
        backButton.addEventListener("click", backButtonHandler);
    }

    // Create a URLSearchParams helper instance targeting the URL parameter query
    const params = new URLSearchParams(window.location.search);

    // Extract specific parameters and decode values safely using decodeURIComponent
    const countryName = params.get("name") ? decodeURIComponent(params.get("name")) : "N/A";
    const flagPath = params.get("flag") ? decodeURIComponent(params.get("flag")) : "";
    const rawPopulation = params.get("population") || "0";
    const regionName = params.get("region") || "N/A";
    const subRegionName = params.get("subRegion") ? decodeURIComponent(params.get("subRegion")) : "N/A";
    const capitalCity = params.get("capital") ? decodeURIComponent(params.get("capital")) : "N/A";
    const currencyValues = params.get("currencies") ? decodeURIComponent(params.get("currencies")) : "N/A";
    const languageValues = params.get("languages") ? decodeURIComponent(params.get("languages")) : "N/A";

    // Format numeric raw metrics into readable text streams
    const formattedPopulation = parseInt(rawPopulation).toLocaleString();

    // Inject values dynamically into the layout DOM placeholder elements
    document.getElementById("detail-name").textContent = countryName;
    document.getElementById("detail-flag").src = flagPath;
    document.getElementById("detail-flag").alt = `Official Flag representation of ${countryName}`;
    
    document.getElementById("detail-population").textContent = formattedPopulation;
    document.getElementById("detail-region").textContent = regionName;
    document.getElementById("detail-subregion").textContent = subRegionName;
    document.getElementById("detail-capital").textContent = capitalCity;
    document.getElementById("detail-currencies").textContent = currencyValues;
    document.getElementById("detail-languages").textContent = languageValues;
});