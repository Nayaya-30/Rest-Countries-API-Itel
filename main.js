const toggle = document.getElementById("toggle");
const body = document.body;

let theme = false;
toggle.addEventListener("click", () => {
    theme = !theme;
    toggle.innerHTML = theme
        ? `<i class="fa-solid fa-sun"></i> Light Mode`
        : `<i class="fa-solid fa-moon"></i> Dark Mode`;
    body.classList.toggle("dark");
});

let selectedRegion;
let searchedTerm;

const searches = document.querySelector(".search");

searches.addEventListener("change", e => {
    searchedTerm = searches.value.toLowerCase();
    const filtered = countriesData.filter(country =>
        country.name.toLowerCase().includes(searchedTerm)
    );
    renderCountries(filtered);
});

const selects = document.querySelector(".select-wrapper");
const selected = selects.querySelector(".selected");
const options = selects.querySelectorAll(".options li");

// to toggle the options dropdown
selected.addEventListener("click", e => {
    selects.classList.toggle("open");
    e.stopPropagation(); // prevent window click from closing immediately
});

// To select a region from the options
options.forEach(option => {
    option.addEventListener("click", e => {
        selected.textContent = option.textContent;
        selectedRegion = option.dataset.value;

        let filtered = countriesData;
        let region = selectedRegion.toLowerCase();
        if (selectedRegion) {
            filtered = countriesData.filter(
                country => country.region === region
            );
        }

        renderCountries(filtered);
        e.stopPropagation();
    });
});

// To close the select options on window click
window.addEventListener("click", () => {
    selects.classList.remove("open");
});

let countriesData = []; // store all data globally

async function Countries() {
    try {
        const res = await fetch("./data.json");
        const data = await res.json();
        countriesData = data; // save for filtering later
        renderCountries(data);
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

function renderCountries(data) {
    const countries = document.getElementById("countries");
    countries.innerHTML = "";

    data.map(item => {
        const article = document.createElement("secti");
        article.classList.add("container");

        article.innerHTML = `
        <article class='card'
      <img src="${item.flag}" alt="${item.name} flag" width="100" />
      
      <div class="details">
      <h2>${item.name}</h2>
      <p><strong>Population:</strong> ${item.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${item.region}</p>
      <p><strong>Capital:</strong> ${item.capital}</p>
      </div>
      </article>
    `;

        countries.appendChild(article);
    });
}

Countries();
