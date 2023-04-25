const imageContainer = document.querySelector('.image-container');
const image = document.querySelector('.image');
const previousButton = document.querySelector('#previous');
const nextButton = document.querySelector('#next');
const pokemonNumberName = document.querySelector('#pokemon_number-name');
const pokemonType1 = document.querySelector('#pokemon_type1');
const pokemonType2 = document.querySelector('#pokemon_type2');

let currentImageIndex = 0;
let pokemonData = [];

function showCurrentImage() {
  const defaultImage = 'resources/img/0.3.png';
  const pokemonImage = pokemonData[currentImageIndex].image;
  
  if (!pokemonImage) {
    image.src = defaultImage;
  } else {
    image.src = pokemonImage;
  }
  
  pokemonNumberName.textContent = pokemonData[currentImageIndex].number + " " + pokemonData[currentImageIndex].name;
  
  const type1 = pokemonData[currentImageIndex].type1;
  pokemonType1.textContent = type1;
  pokemonType1.style.backgroundColor = getTypeColor(type1);
  
  const type2 = pokemonData[currentImageIndex].type2;
  if (type2) {
    pokemonType2.textContent = type2;
    pokemonType2.style.backgroundColor = getTypeColor(type2);
    pokemonType2.style.display = '';
  } else {
    pokemonType2.style.display = 'none';
  }
}


function getTypeColor(type) {
  const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    fighting: '#C03028',
    water: '#6890F0',
    flying: '#A890F0',
    grass: '#78C850',
    poison: '#A040A0',
    electric: '#F8D030',
    ground: '#E0C068',
    psychic: '#F85888',
    rock: '#B8A038',
    ice: '#98D8D8',
    bug: '#A8B820',
    dragon: '#7038F8',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };
  
  return typeColors[type.toLowerCase()] || '#FFFFFF';
}


function previousImage() {
  currentImageIndex--;
  if (currentImageIndex < 0) {
    currentImageIndex = pokemonData.length - 1;
  }
  showCurrentImage();
}

function nextImage() {
  currentImageIndex++;
  if (currentImageIndex >= pokemonData.length) {
    currentImageIndex = 0;
  }
  showCurrentImage();
}

function fetchPokemonData() {
  const limit = 10000;
  const pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

  fetch(pokemonApiUrl)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      const promises = results.map(result => fetch(result.url));
      Promise.all(promises)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(pokemonDataArray => {
          pokemonData = pokemonDataArray.map(data => {
            const { id, name, sprites, types } = data;
            return {
              number: id,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              image: sprites.front_default,
              type1: types[0].type.name.charAt(0).toUpperCase() + types[0].type.name.slice(1),
              type2: types[1] ? types[1].type.name.charAt(0).toUpperCase() + types[1].type.name.slice(1) : null
            }
          });
          showCurrentImage();
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

previousButton.addEventListener('click', previousImage);
nextButton.addEventListener('click', nextImage);

fetchPokemonData();

//___________Busqueda_______________________________

const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const matchedPokemon = pokemonData.find(pokemon => pokemon.name.toLowerCase().includes(searchTerm));

  if (matchedPokemon) {
    currentImageIndex = pokemonData.indexOf(matchedPokemon);
    showCurrentImage();
  }
});
