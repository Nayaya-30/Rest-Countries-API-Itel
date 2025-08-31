const toggle = document.getElementById("toggle");
const body = document.body;

let theme = false;
function updateToggle() {
    toggle.innerHTML = theme
        ? `<i class="fa-solid fa-sun"></i> Light Mode`
        : `<i class="fa-solid fa-moon"></i> Dark Mode`;
}
// Load theme on startup
function loadTheme() {
    let theme = localStorage.getItem("theme");

    if (!theme) {
        // No theme saved → use system preference
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "light"
            : "dark";
    }

    applyTheme(theme);
}

// Apply theme
function applyTheme(theme) {
    if (theme === "dark") {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        toggle.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`;
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        toggle.innerHTML =          `<i class="fa-solid fa-moon"></i> Dark Mode`;
    }
}

// Toggle theme on button click
toggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
        applyTheme("light");
    } else {
        applyTheme("dark");
    }
    theme = !theme;
    updateToggle();
});

// Run on load
loadTheme();

const searchInput = document.querySelector(".search");
const selects = document.querySelector(".select-wrapper");
const selected = selects.querySelector(".selected");
const options = selects.querySelectorAll(".options li");
const dropDown = selects.querySelector(".options");
const arrow = selects.querySelector("i");

selects.addEventListener("click", e => {
    selects.classList.toggle("open");
    arrow.classList.toggle("open");
    dropDown.classList.remove("fade-out-right");
    dropDown.classList.add("fade-in-right");
    e.stopPropagation(); // prevent window click from closing immediately
});

window.addEventListener("click", () => {
    selects.classList.remove("open");
    arrow.classList.remove("open");
    dropDown.classList.remove("fade-in-right");
});

let countriesData = [];
let selectedRegion = "";
let searchQuery = "";

// 🔍 search input
searchInput.addEventListener("input", e => {
    searchQuery = e.target.value;
    applyFilters();
});

// 🌍 region dropdown
options.forEach(option => {
    option.addEventListener("click", e => {
        selectedRegion = option.dataset.value;
        selected.textContent = option.textContent;

        if (selectedRegion === "all") {
            selectedRegion = "";
        }

        searchInput.value = "";
        searchQuery = "";

        selects.classList.remove("open");
        arrow.classList.remove("open");
        applyFilters();
        e.stopPropagation();
    });
});

const countries = document.getElementById("countries");

// Asyncronous function to fetch dada
async function fetchCountries() {
    const res = await fetch(
        "https://restcountries.com/v3.1/independent?status=true"
    );
    countriesData = await res.json();

    countries.innerHTML = `<p>Loading...</p>`;

    renderCountries(countriesData); // show all at start
}

// A function to filter data by region and search value
function applyFilters() {
    let filtered = countriesData;

    if (selectedRegion) {
        filtered = filtered.filter(
            c => c.region.toLowerCase() === selectedRegion.toLowerCase()
        );
    }

    if (searchQuery) {
        filtered = filtered.filter(c =>
            c.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    renderCountries(filtered);
}

// A function to render the countries dynamically
function renderCountries(data) {
    countries.innerHTML = "";

    data.forEach((item, index) => {
        const article = document.createElement("article");
        article.classList.add("card", "hover-grow");

        // apply custom animation delay based on grid index
        article.style.animationDelay = `${(index % 2) * 0.2}s`;
        // left card: 0s, right card: 0.2s (row-wise)

        article.innerHTML = `
          <img src="${item.flags.png}" alt="${item.name.common} flag" />
          <div class="details">
            <h2>${item.name.common}</h2>
            <p><strong>Population:</strong> ${item.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${item.region}</p>
            <p><strong>Capital:</strong> ${item.capital?.[0]}</p>
          </div>
        `;

        article.addEventListener("click", () => {
            countryDetails(item);
        });

        countries.appendChild(article);

        // observe after appending
        observer.observe(article);
    });
}

// Funtion call on load
fetchCountries();

// keep a history stack of visited countries
let historyStack = [];
const inputSection = document.querySelector(".input");
const countryPage = document.getElementById("country-page");

// A function to render country detail on a dedicated page
function countryDetails(country) {
    // push current country into history before showing new one
    if (
        historyStack.length === 0 ||
        historyStack[historyStack.length - 1].cca3 !== country.cca3
    ) {
        historyStack.push(country);
    }

    countries.style.display = "none";
    inputSection.style.display = "none";
    countryPage.style.display = "block";

    // Building border buttons
    let borderHTML = "None";
    if (country.borders) {
        borderHTML = country.borders
            .map(code => {
                const borderCountry = countriesData.find(c => c.cca3 === code);
                return borderCountry
                    ? `<button class="border-btn btn" data-code="${borderCountry.cca3}">
               ${borderCountry.name.common}
             </button>`
                    : "";
            })
            .join(" ");
    }

    countryPage.innerHTML = `
    <div class="btns">
      <button class='btn' id="back-btn">
      <i class="fa-solid fa-angles-left"></i>
      <span>Back</span>
      </button>
      <button class='btn' id="home-btn">
      <i class="fa-solid fa-house"></i>
      <span>Home</span>
      </button>
    </div>
    
    <article class="details-page">
      <img class="fade-in-up" src="${country.flags.svg}" alt="${
          country.name.common
      } flag" />
      
      <div class="sub fade-in-up">
        <h2>${country.name.official}</h2>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion ?? "N/A"}</p>
        <p><strong>Capital:</strong> ${country.capital?.join(", ") ?? "N/A"}</p>
        <p><strong>Languages:</strong> ${
            country.languages
                ? Object.values(country.languages).join(", ")
                : "N/A"
        }</p>
        <p><strong>Currencies:</strong> ${
            country.currencies
                ? Object.values(country.currencies)
                      .map(c => `${c.name} (${c.symbol})`)
                      .join(", ")
                : "N/A"
        }</p>
        <p><strong>Border Countries:</strong><span class="borders">${borderHTML}</span></p>
      </div>
    </article>
  `;

    // Back button (uses history)
    document.getElementById("back-btn").addEventListener("click", () => {
        historyStack.pop(); // remove current
        const prevCountry = historyStack.pop(); // go one step back
        if (prevCountry) {
            countryDetails(prevCountry);
        } else {
            // if no history, go home
            goHome();
        }
    });

    // Home button (always reset to list)
    document.getElementById("home-btn").addEventListener("click", () => {
        goHome();
    });

    // Border buttons logic
    document.querySelectorAll(".border-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const code = btn.dataset.code;
            const newCountry = countriesData.find(c => c.cca3 === code);
            if (newCountry) {
                countryDetails(newCountry);
            }
        });
    });
}

function goHome() {
    historyStack = []; // reset history
    countryPage.style.display = "none";
    inputSection.style.display = "block";
    countries.style.display = "grid";
}

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all cards currently rendered
                const allCards = Array.from(document.querySelectorAll(".card"));
                const index = allCards.indexOf(entry.target);

                // Row-wise: if you have 2 columns
                const col = index % 2; // 0 = left, 1 = right
                const row = Math.floor(index / 2);

                // Add a staggered delay
                entry.target.style.animationDelay = `${
                    row * 0.05 + col * 0.05
                }s`;
                entry.target.classList.add("fade-in-up");

                observer.unobserve(entry.target); // animate once
            }
        });
    },
    { threshold: 0 }
);

function showCountryDetails() {
    const countriesSection = document.getElementById("countries");
    const inputSection = document.querySelector(".input");
    const countryPage = document.getElementById("country-page");

    countriesSection.style.display = "none";
    inputSection.style.display = "none";

    countryPage.style.display = "block";
    setTimeout(() => {
        countryPage.classList.add("active"); // triggers animation
    }, 10); // small delay so CSS transition runs
}

function goBack() {
    const countriesSection = document.getElementById("countries");
    const inputSection = document.querySelector(".input");
    const countryPage = document.getElementById("country-page");

    countryPage.classList.remove("active");

    // wait for animation to finish before hiding
    setTimeout(() => {
        countryPage.style.display = "none";
        countriesSection.style.display = "grid";
        inputSection.style.display = "block";
    }, 500); // match transition time
}

showCountryDetails();
goBack();
