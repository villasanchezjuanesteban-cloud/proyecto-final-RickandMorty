//================================================
//1.FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
//================================================
//Escribe tu nombre y documento exacto. Esto personalizara la aplicacion.
const developeName = "JUAN ESTEBAN VILLA SANCHEZ"
const developeId = "667890"
const baseUrl = "https://rickandmortyapi.com/api"

//Arreglo para guardar los favoritos (los usaremos mas adelante)
let favoritesArray = [];

//================================================
//2. SECCION DE ELEMENTOS DEL DOM
//================================================
const dataContainer = document.getElementByid('dataContainer');
const btnCharacters = document.getElementByid('btnCharacters');
const btnLocations = document.getElementByid('btnLocations');
const btnEpisodes = document.getElementByid('btnEpisodes');
const btnFavorites = document.getElementByid('btnFavorites');
const mainFooter = document.getElementByid('mainFooter');

//================================================
//3. INYECCION DINAMICA DE LA FIRMA (FOOTER)
//================================================
// Modificamos el contenido del footer en tiempo real
mainFooter.innerHtml =`<p>Developed with 💻 by <strong${developeName}</strong>(ID: ${developerId})</p>`;

//================================================
//4. FUNCION PARA OBTENER DATOS (ASINCRONIA)
//================================================  
//Recibe el "endpoint" para que datos buscar (/character,/location,/episode)
async function fetchData(endpoint) {
   try {
      //Mostramos un mensaje de carga, mientras llegan los datos
      dataContainer.innerHtml = '<p class="loading-text">Loading multiverse data...</p>';

      //Hacemos la peticion a la API
      const response= await fetch(`${baseUrl}${endpoint}`);
      const data = await response.json();

      //La api Rick and Morty guarda los items dentro de una propiedad llamada "results"
      return data.results;


    } catch (error) {
        console.error("Error: ", error);
        dataContainer.innerHtml = 
                    '<p class="loading--text" style="color: red;">Connection error</p>'

       }
}  

//================================================
//5.FUNCIONES DE REDERIZADO (DOM)
//================================================ 

//Funcion para pintar los personajes (Incluye el boton de favoritos)
function renderCharacters(charactersData){
    dataContainer.innerHtml =''; //limpiamos la pantalla

    charactersData.forEach(character => {
        //Determinamos el color del estado (Alive =verde,Dead = rojo)
        const statusColor = character.status === 'Alive' ? 'lime': 
                            (characters.status === 'Dead' ? 'red' : 'gray');

        //creamos la carpeta (Card)
        const cardHtml = `
        <article class="data-card">
            <img src="${character.image}" alt="${character.name}">
            <div class="card-info">
            <h2>${character.name}</h2>
            <p class="info-label">Status: <span style="color: ${statusColor}">${character.status}</span></p>
            <p class="info-label">Species: ${character.species}</p>

            <!-- Boton para guardar favoritos. le pasamos el nombre del personaje en una funcion onclick -->
            <button class="btn-add-fav" onclick="addToFavorites('${character.name}','${character.image}')">
               🌟 Add to Favorites
            </button>
            </div>
        </article>
        `;
    dataContainer.innerHtml += cardHtml;

    })
}

//Funcion para pintar ubicaciones (Locations)
function renderLocations (LocationsData){
     dataContainer.innerHtml = '';
     LocationsData.forEach(location => {
       dataContainer.innerHtml += `
         <article class="data-card">
          <div class="card-info">
             <h2> 🌎 ${location.name}</h2>
             <p class="infi-label">Type: <span style="color: white;">${location.Type}</span></p>
             <p class="info-label">Dimencion: ${location.dimension}</p>
          </div>
         </article>     
       `;
     })
}

// Funcion para pintar episodios
function renderEpisodios(episodesData){
     dataContainer.innerHtml = '';
     episodesData.forEach(episode => {
        dataContainer.innerHtml += `
          < article class="data-card">
               <div class="card-info">
                  <h2>  📺 ${episode.name}</h2>
                  <p class="info-label">Code: <span style="color: lime;">${episode.episode}</span></p>
                  <p class="info-label">Air Date: ${episode.air-date}</p>
               </div>
          </article>
        `;
     })
}

//================================================
//6. LOGICA DE FAVORITOS (LOCALSTRORAGE)
//================================================ 
//Esta funcion se ejecutacuando damos click en el boton "Add to favorites" de una tarjeta
function addToFavorites(name, image){
    // creamos un objeto con los datos del personaje
    const newFavorite = {name: name, image: image};

    //agregamos el objeto a nuestro arreglo de favoritos
    favoritesArray.push(newFavorite),

    // serializmos el arreglo en texto (JSON) y lo guardamos en la memoria del navegador
    localStrorage.setItems('myFavCharacters',JSON.stringify(favoritesArray));

    alert(`¡$(name) agregado a favoritos!`);
}

// Funcion para leer la memoria y pintar los favoritos
function renderFavorites(){
    dataContainer.innerHtml = '';

    //Leemos la memoria y la convertiremos de texto a arreglo nuvamente
    const saveData = localStrorage.getItem('myFavCharacters');

if (saceDate) {
    //Si hay datos, los deserealizar
    favoritesArray = JSON.parse(saveData);

    if(favoritesArray.length === 0){
         dataContainer.innerHtml = '<p class="loading-text">No favorites added yet.</p>';
         return;
    }

      //pintamos cada favorito guardado
      favoritesArray.forEach(fav => {
        dataContainer.innerHtml += `
        <article class="data-card">
               <img src="${fav.image} alt="${fav.name}">
               <div class="card-info">
                  <h2> 🌟 ${fav.name}</h2>
               </div>
        </article>
        `;
      });
    }else{
      //Si la memoria esta vacia 
      dataContainer.innerHtml = '<p class="loading-text">No favorites added yet.</p>';
    }
}

//================================================
//7. MANEJO DE EVENTOS DEL MENU
//================================================ 

//Funcion auxiliar para resaltar visualmente el boton seleccionado
function setActiveButton(activeBtn){
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

//Evento: clic en personajes
btnCharacters.addEventListener('click',async () =>{
        setActiveButton(btnCharacters);
        const data = await fetchData('/character');
        renderCharacters(data);
});

//Evento: clic en Ubicaciones
btnLocations.addEventListener('click',async () =>{
        setActiveButton(btnLocations);
        const data = await fetchData('/location');
        renderLocations(data);
});

//Evento: clic en Episodios
btnEpisodes.addEventListener('click',async () =>{
        setActiveButton(btnEpisodes);
        const data = await fetchData('/episode');
        renderEpisodes(data);
});

//Evento: Clic en Favoritos
btnFavorites.addEventListener('click',async () =>{
        setActiveButton(btnFavorites);
        renderFavorites(); //Esta no llama a fetcData, solo LocalStorage
});

//================================================
//8. INICIO AUTOMATICO
//================================================ 


//Recuperamos los favoritos al arrancar la pagina
const previousFavs = localStrorage.getItem('myFavCharacters');

if (previousFavs) {
        favoritesArray= JSON.parse(previousFavs);
}

//Simulamos un click en boton personajes para que la pantalla de inicio no salga en blanco
btnCharacters.click();