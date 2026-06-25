// Global variable state paths
const countryCardsContainer = document.getElementById('country-cards-container');
let displayCount = 12; // Updated from 8 to 12 so twelve cards display on initial load
let countries = []; 

// Target DOM nodes for filters and controls
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('region-filter');
const populationFilter = document.getElementById('population-filter');
const showMoreBtn = document.getElementById('show-more-btn');

/**
 * STAGE 1: Implement getFormattedNames()
 * Takes an array of objects (like languages or currencies) and returns 
 * a single comma-separated string of their "name" properties.
 */
function getFormattedNames(dataArray) {
    if (!dataArray || !Array.isArray(dataArray) || dataArray.length === 0) {
        return "N/A";
    }

    const names = [];
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].name) {
            names.push(dataArray[i].name);
        }
    }

    return names.join(", ");
}

function getFormattedCurrencies(currencies) {
    if (!currencies) {
        return "N/A";
    }

    if (Array.isArray(currencies)) {
        const names = currencies
            .filter(currency => currency && currency.name)
            .map(currency => currency.name);

        return names.length > 0 ? names.join(", ") : "N/A";
    }

    if (typeof currencies === 'object') {
        const currencyCodes = Object.keys(currencies);
        const names = currencyCodes.reduce((result, code) => {
            const curr = currencies[code];
            if (curr && curr.name) {
                result.push(curr.name);
            }
            return result;
        }, []);
        return names.length > 0 ? names.join(", ") : "N/A";
    }

    return "N/A";
}

function getFormattedLanguages(languages) {
    if (!languages) {
        return "N/A";
    }

    if (Array.isArray(languages)) {
        const names = languages
            .filter(lang => lang && typeof lang.name === 'string')
            .map(lang => lang.name);

        return names.length > 0 ? names.join(", ") : "N/A";
    }

    if (typeof languages === 'object') {
        const languageCodes = Object.keys(languages);
        const names = languageCodes.reduce((result, code) => {
            const value = languages[code];
            if (typeof value === 'string') {
                result.push(value);
            }
            return result;
        }, []);
        return names.length > 0 ? names.join(", ") : "N/A";
    }

    return "N/A";
}

function fetchData() {
    return fetch('/countries')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .catch(function (error) {
            console.error('Error fetching countries data', error);
            throw error;
        });
}

/**
 * STAGE 2: Implement countryCardHandler()
 * Handles clicking a country card by formatting its data into a safe query string
 * and redirecting the user to the details page.
 */
function countryCardHandler(country) {
    let queryString =
        "?name=" +
        encodeURIComponent(country.name.official) +
        "&flag=" +
        encodeURIComponent(country.flags.png) + 
        "&population=" +
        country.population +
        "&region=" +
        encodeURIComponent(country.region) +
        "&subRegion=" +
        encodeURIComponent(country.subregion) +
        "&capital=" +
        encodeURIComponent(country.capital) +
        "&currencies=" +
        encodeURIComponent(getFormattedCurrencies(country.currencies)) + 
        "&languages=" +
        encodeURIComponent(getFormattedLanguages(country.languages));   

    window.location.href = "details.html" + queryString;
}

/**
 * STAGE 3: Modified populateCountryCards() function
 * Renders the layout grid and registers click event handlers onto each card element.
 */
function populateCountryCards(countriesArray, limit) {
    countryCardsContainer.innerHTML = "";

    if (countriesArray.length === 0) {
        const errorMessage = document.createElement('p');
        errorMessage.className = 'no-results';
        errorMessage.textContent = 'No country found matching the search criteria.';
        countryCardsContainer.appendChild(errorMessage);
    } 
    else {
        let loopCounter = Math.min(limit, countriesArray.length);

        for (let i = 0; i < loopCounter; i++) {
            const country = countriesArray[i];

            const card = document.createElement('div');
            card.classList.add('country-card');

            const flagImg = document.createElement('img');
            flagImg.src = country.flags.png; 
            flagImg.alt = `Flag of ${country.name.common}`; 

            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');

            const countryName = document.createElement('h3');
            countryName.textContent = country.name.common;

            const countryPopulation = document.createElement('p');
            countryPopulation.innerHTML = `<strong>Population:</strong> ${country.population.toLocaleString()}`;

            const countryCapital = document.createElement('p');
            countryCapital.innerHTML = `<strong>Capital:</strong> ${country.capital || 'N/A'}`;

            const countryRegion = document.createElement('p');
            countryRegion.innerHTML = `<strong>Region:</strong> ${country.region}`;

            cardContent.appendChild(countryName);
            cardContent.appendChild(countryPopulation);
            cardContent.appendChild(countryCapital);
            cardContent.appendChild(countryRegion);

            card.appendChild(flagImg);
            card.appendChild(cardContent);

            // Register countryCardHandler as an event listener
            card.addEventListener('click', () => {
                countryCardHandler(country);
            });

            countryCardsContainer.appendChild(card);
        } 
    } 
}

/**
 * Input validation and core filter routine handling (filterData)
 */
function filterData() {
    const inputValue = searchInput.value.trim();
    const populationValue = parseInt(populationFilter.value) || 0;

    let regex = new RegExp(/^[a-zA-Z -]*$/);
    if (!regex.test(inputValue)) {
        populateCustomErrorMessage("Enter valid Country Name.");
        return false;
    }

    if (populationValue > 1500000000) {
        populateCustomErrorMessage("Country’s population cannot be greater than 1.5 billion.");
        return false;
    }

    const searchTerm = inputValue.toLowerCase();
    const selectedRegion = regionFilter.value;

    const filteredCountries = countries.filter(country => {
        const matchesName = country.name.common.toLowerCase().includes(searchTerm);
        const matchesRegion = selectedRegion === "" || country.region === selectedRegion;
        const matchesPopulation = country.population >= populationValue;

        return matchesName && matchesRegion && matchesPopulation;
    });

    displayCount = 12; // Reset baseline initial view back to 12 when user alters filter fields
    populateCountryCards(filteredCountries, displayCount);
}

/**
 * Helper utility to inject validation alerts inside the main card area
 */
function populateCustomErrorMessage(message) {
    countryCardsContainer.innerHTML = "";
    const alertMessage = document.createElement('p');
    alertMessage.className = 'no-results';
    alertMessage.style.color = 'red';
    alertMessage.style.fontWeight = 'bold';
    alertMessage.textContent = message;
    countryCardsContainer.appendChild(alertMessage);
}

// Register event handlers to all filter fields
searchInput.addEventListener('input', filterData);
regionFilter.addEventListener('change', filterData);
populationFilter.addEventListener('input', filterData);

// Pagination adjustment logic
showMoreBtn.addEventListener('click', () => {
    displayCount += 8; // Correctly increments the view window by 8 more items per click

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;
    const populationValue = parseInt(populationFilter.value) || 0;

    const currentFilteredList = countries.filter(country => {
        return country.name.common.toLowerCase().includes(searchTerm) &&
               (selectedRegion === "" || country.region === selectedRegion) &&
               country.population >= populationValue;
    });

    populateCountryCards(currentFilteredList, displayCount);
});

// Load event initialization
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
        .then(function (data) {
            countries = data;
            populateCountryCards(countries, displayCount);
        })
        .catch(function (error) {
            populateCustomErrorMessage('Unable to load country data. Please try again later.');
            console.error('Failed to load countries:', error);
        });
});