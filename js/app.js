// ================================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
// ================================================

const developeName = "JUAN ESTEBAN VILLA SANCHEZ";
const developeId = "667890";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los favoritos
let favoritesArray = [];

// ================================================
// 2. SECCION DE ELEMENTOS DEL DOM
// ================================================

const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');

// ================================================
// 3. INYECCION DINAMICA DE LA FIRMA (FOOTER)
// ================================================

mainFooter.innerHTML = `
    <p>Developed with 💻 by
    <strong>${developeName}</strong> (ID: ${developeId})</p>
`;

// ================================================
// 4. FUNCION PARA OBTENER DATOS (ASINCRONIA)
// ================================================

async function fetchData(endpoint) {
    try {
        dataContainer.innerHTML =
            '<p class="loading-text">Loading multiverse data...</p>';

        const response = await fetch(`${baseUrl}${endpoint}`);

        if (!response.ok) {
            throw new Error('Could not get data from the API');
        }

        const data = await response.json();

        return data.results;

    } catch (error) {
        console.error("Error:", error);

        dataContainer.innerHTML =
            '<p class="loading-text" style="color: red;">Connection error. Please try again.</p>';

        return null;
    }
}

// ================================================
// 5. FUNCIONES DE RENDERIZADO (DOM)
// ================================================

// Mostrar personajes
function renderCharacters(charactersData) {
    if (!charactersData) return;

    dataContainer.innerHTML = '';

    charactersData.forEach(character => {

        const statusColor =
            character.status === 'Alive' ? 'lime' :
            character.status === 'Dead' ? 'red' : 'gray';

        const cardHtml = `
            <article class="data-card">
                <img src="${character.image}" alt="${character.name}">

                <div class="card-info">
                    <h2>${character.name}</h2>

                    <p class="info-label">
                        Status:
                        <span style="color: ${statusColor}">
                            ${character.status}
                        </span>
                    </p>

                    <p class="info-label">
                        Species: ${character.species}
                    </p>

                    <button class="btn-add-fav"
                        onclick="addToFavorites('${character.name.replace(/'/g, "\\'")}', '${character.image}')">
                        🌟 Add to Favorites
                    </button>
                </div>
            </article>
        `;

        dataContainer.innerHTML += cardHtml;
    });
}

// Mostrar ubicaciones
function renderLocations(locationsData) {
    if (!locationsData) return;

    dataContainer.innerHTML = '';

    locationsData.forEach(location => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>🌎 ${location.name}</h2>

                    <p class="info-label">
                        Type: ${location.type}
                    </p>

                    <p class="info-label">
                        Dimension: ${location.dimension}
                    </p>
                </div>
            </article>
        `;
    });
}

// Mostrar episodios
function renderEpisodes(episodesData) {
    if (!episodesData) return;

    dataContainer.innerHTML = '';

    episodesData.forEach(episode => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>📺 ${episode.name}</h2>

                    <p class="info-label">
                        Code:
                        <span style="color: lime">
                            ${episode.episode}
                        </span>
                    </p>

                    <p class="info-label">
                        Air Date: ${episode.air_date}
                    </p>
                </div>
            </article>
        `;
    });
}

// ================================================
// 6. LOGICA DE FAVORITOS (LOCAL STORAGE)
// ================================================

// Agregar un personaje a favoritos
function addToFavorites(name, image) {
    const alreadyExists = favoritesArray.some(
        favorite => favorite.name === name
    );

    if (alreadyExists) {
        alert(`${name} ya esta en favoritos.`);
        return;
    }

    const newFavorite = {
        name: name,
        image: image
    };

    favoritesArray.push(newFavorite);

    localStorage.setItem(
        'myFavCharacters',
        JSON.stringify(favoritesArray)
    );

    alert(`¡${name} agregado a favoritos!`);
}

// Mostrar favoritos
function renderFavorites() {
    dataContainer.innerHTML = '';

    const saveData = localStorage.getItem('myFavCharacters');

    if (saveData) {
        favoritesArray = JSON.parse(saveData);
    } else {
        favoritesArray = [];
    }

    if (favoritesArray.length === 0) {
        dataContainer.innerHTML =
            '<p class="loading-text">No favorites added yet.</p>';
        return;
    }

    favoritesArray.forEach(favorite => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <img src="${favorite.image}" alt="${favorite.name}">

                <div class="card-info">
                    <h2>🌟 ${favorite.name}</h2>
                </div>
            </article>
        `;
    });
}

// ================================================
// 7. MANEJO DE EVENTOS DEL MENU
// ================================================

// Resaltar el boton seleccionado
function setActiveButton(activeBtn) {
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

// Evento: personajes
btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);

    const data = await fetchData('/character');

    if (data) {
        renderCharacters(data);
    }
});

// Evento: ubicaciones
btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);

    const data = await fetchData('/location');

    if (data) {
        renderLocations(data);
    }
});

// Evento: episodios
btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);

    const data = await fetchData('/episode');

    if (data) {
        renderEpisodes(data);
    }
});

// Evento: favoritos
btnFavorites.addEventListener('click', () => {
    setActiveButton(btnFavorites);
    renderFavorites();
});

// ================================================
// 8. INICIO AUTOMATICO
// ================================================

// Recuperar los favoritos guardados
const previousFavs = localStorage.getItem('myFavCharacters');

if (previousFavs) {
    try {
        favoritesArray = JSON.parse(previousFavs);
    } catch (error) {
        console.error("Error loading favorites:", error);
        favoritesArray = [];
    }
}

// Mostrar los personajes al abrir la pagina
btnCharacters.click();