const apiUrl = 'https://pokeapi.co/api/v2/';

let pokemonImage;
let pokemonInfo;

document.addEventListener('DOMContentLoaded', (e) => {
    SetHUD();
});

function SetHUD() {
    pokemonImage = document.getElementById('pokemonImage');
    pokemonInfo = document.getElementById('pokemonInfo');
}

/**Realiza un fetch a partir de la raíz de la pokeapi adicionando la extensión deseada y ejecutando una función con el resultado */
function FetchData(endpoint, callback) {
    fetch(apiUrl + endpoint)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error en el fetch: ', error));
}

/**Setea los elementos de la interfaz con los resultados brindados al buscarse un pokemon */
function DisplayPokemonInfo(name, imageUrl, description) {
    pokemonImage.src = imageUrl;
    pokemonInfo.innerText = `Nombre: ${name}\nDescripción: ${description}`;
}

/**Setea los elementos de la interfaz con los resultados brindados al buscarse una habilidad */
function DisplayAbilityInfo(name, effect) {
    pokemonImage.src = './img/kawax-pokeball-3097.webp'; 
    GetTranslatedEffect(name, 'ability', effect, (translatedEffect) => {
        pokemonInfo.innerText = `Habilidad: ${name}\nEfecto: ${translatedEffect}`;
    });
}

/**Setea los elementos de la interfaz con los resultados brindados al buscarse un movimiento */
function DisplayMoveInfo(name, effect, accuracy, power) {
    pokemonImage.src = './img/kawax-pokeball-3097.webp'; 
    GetTranslatedEffect(name, 'move', effect, (translatedEffect) => {
        pokemonInfo.innerText = `Movimiento: ${name}\nAcierto: ${accuracy}\nDaño Base: ${power}\nEfecto: ${translatedEffect}`;
    });
}

/**Consigue la información para setear los elementos de la interfaz, asignandole un idioma y usando como estandar el español */
function GetTranslatedEffect(name, category, originalEffect, callback) {
    FetchData(`${category}/${name}`, (data) => {
        const languageCode = 'es'; 
        const translatedEffect = GetTranslatedDescription(data.effect_entries, languageCode) || GetTranslatedDescription(data.effect_entries, 'en') || originalEffect;
        callback(translatedEffect);
    });
}

function GetTranslatedDescription(effectEntries, languageCode) {
    const translation = effectEntries.find(entry => entry.language.name === languageCode);
    return translation ? translation.effect : null;
}

function GetPokemonDescription(flavorTextEntries, languageCode) {
    const translation = flavorTextEntries.find(entry => entry.language.name === languageCode /*&& entry.version.name === 'scarlet'*/);
    return translation ? translation.flavor_text : null;
}

/**Consigue mediante el nombre o el id la información e imagen de un pokemon, buscando una descipción en español
*/
function GetPokemonInfo() {
    const pokemonName = prompt('Ingrese el nombre o número del Pokémon:');
    if (pokemonName) {
        FetchData(`pokemon-species/${pokemonName.toLowerCase()}`, (speciesData) => {
            const name = speciesData.name;
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesData.id}.png`;

            const description = GetPokemonDescription(speciesData.flavor_text_entries, 'es') || GetPokemonDescription(speciesData.flavor_text_entries, 'en') || 'Información no disponible en la base de datos';

            DisplayPokemonInfo(name, imageUrl, description);
        });
    }
}

/**Consigue mediante el nombre o el id la información de una habilidad, buscando la descripción en español */
function GetAbilities() {
    const abilityName = prompt('Ingrese el nombre de la habilidad:');
    if (abilityName) {
        FetchData(`ability/${abilityName}`, (data) => {
            const name = data.name;
            const effect = data.effect_entries.find(entry => entry.language.name === 'es' || entry.language.name === 'en')?.effect || 'Información no disponible en la base de datos';
            DisplayAbilityInfo(name, effect);
        });
    }
}

/**Consigue mediante el nombre o el id la información de un movimiento, buscando la descripción en español */
function GetMoves() {
    const moveName = prompt('Ingrese el nombre del movimiento:');
    if (moveName) {
        FetchData(`move/${moveName}`, (data) => {
            const name = data.name;
            const effect = data.effect_entries.find(entry => entry.language.name === 'es' || entry.language.name === 'en')?.effect || 'Información no disponible en la base de datos';
            const accuracy = data.accuracy;
            const power = data.power;
            DisplayMoveInfo(name, effect, accuracy, power);
        });
    }
}