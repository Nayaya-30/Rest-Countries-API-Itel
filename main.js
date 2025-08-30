const toggle = document.getElementById('toggle');
const body = document.body;

let theme = false;
toggle.addEventListener('click', () => {
  theme = !theme;
  toggle.innerHTML = theme ? `<i class="fa-solid fa-sun"></i> Light Mode` : `<i class="fa-solid fa-moon"></i> Dark Mode`;
  body.classList.toggle('dark');
});

let selectedRegion;
let searchedTerm;

const regions = document.getElementById("region");
const searches = document.querySelector(".search");

searches.addEventListener('change', (e) => {
  searchedTerm = searches.value;
  console.log(searchedTerm);
});
regions.addEventListener("change", (e) => {
  selectedRegion = e.target.value;
  console.log(selectedRegion);
});

// function handleChange(e) {
//   selectedRegion = e.target.value;
//   console.log(selectedRegion);
// }