// Array para almacenar los personajes
let characters = [];

// Variable para almacenar la respuesta actual
let answer = null;

// Event listener para cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Fetch para cargar los datos de los personajes
    fetch('./data/servants.json')
        .then(response => response.json())
        .then(data => {
            characters = data; // Guardamos los personajes
            answer = characters[Math.floor(Math.random() * characters.length)]; // Seleccionamos una respuesta aleatoria
            renderAutocompleteList(); // Renderizamos la lista de autocompletado
        })
        .catch(error => console.error('Error al cargar los datos:', error));
});

// Función para renderizar la lista de autocompletado
function renderAutocompleteList() {
    const autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.innerHTML = '';

    characters.forEach(character => {
        const item = document.createElement('div');
        item.innerHTML = `<img src="${character.image}" alt="${character.name}" style="width:30px; height:30px; margin-right:10px;"><span>${character.name}</span>`;
        item.addEventListener('click', () => {
            guessInput.value = character.name;
            autocompleteList.style.display = 'none'; // Ocultar la lista al hacer clic en un personaje
        });
        autocompleteList.appendChild(item);
    });
}

// Event listener para el input de adivinanza
const guessInput = document.getElementById('guess-input');
guessInput.addEventListener('input', handleInput);

// Ocultar la lista al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const autocompleteList = document.getElementById('autocomplete-list');
    autocompleteList.style.display = 'none';
});

// Función para manejar el input de adivinanza
function handleInput() {
    const value = guessInput.value.toLowerCase();
    const autocompleteList = document.getElementById('autocomplete-list');

    if (!value) {
        autocompleteList.style.display = 'none'; // Ocultar la lista si el valor está vacío
        return;
    }

    const filteredCharacters = characters.filter(character => character.name.toLowerCase().startsWith(value));

    autocompleteList.innerHTML = '';

    if (filteredCharacters.length > 0) {
        // Mostrar la lista y renderizar los elementos si hay personajes coincidentes
        autocompleteList.style.display = 'block';
        filteredCharacters.forEach(character => {
            const item = document.createElement('div');
            item.innerHTML = `<img src="${character.image}" alt="${character.name}" style="width:30px; height:30px; margin-right:10px;"><span>${character.name}</span>`;
            item.addEventListener('click', () => {
                guessInput.value = character.name;
                autocompleteList.style.display = 'none'; // Ocultar la lista al hacer clic en un personaje
            });
            autocompleteList.appendChild(item);
        });
    } else {
        autocompleteList.style.display = 'none'; // Ocultar la lista si no hay personajes coincidentes
    }
}

// Event listener para el botón de adivinar
const submitGuessButton = document.getElementById('submit-guess');
submitGuessButton.addEventListener('click', handleGuess);
const resultsDisplay = document.getElementById('results');

// Función para manejar la adivinanza
function handleGuess() {
    const guess = guessInput.value.trim();
    const character = characters.find(c => c.name.toLowerCase() === guess.toLowerCase());

    if (!character) {
        setMessage('Personaje no encontrado');
        return;
    }

    // Resto del código para agregar el personaje a la tabla de resultados
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
        <td class="result-item"><img src="${character.image}" alt="${character.name}"></td>
        <td class="${getMatch(character.gender, answer.gender)}">${character.gender}</td>
        <td class="${getMatch(character.class, answer.class)}">${character.class}</td>
        <td class="${getMatch(character.np, answer.np)}">${character.np}</td>
        <td class="${getMatchSeries(character.series, answer.series)}">${character.series.join(', ')}</td>
        <td class="${getMatchArray(character.origin, answer.origin)}">${character.origin.join(', ')}</td>
        <td class="${getMatchArray(character.region, answer.region)}">${character.region.join(', ')}</td>
        <td class="${getMatch(character.alignment, answer.alignment)}">${character.alignment}</td>
        <td class="${getMatch(character.variation, answer.variation)}">${character.variation}</td>
        <td class="${getMatch(character.stars, answer.stars)}">${character.stars}</td>
    `;

    resultsDisplay.insertBefore(resultRow, resultsDisplay.firstChild);
    guessInput.value = '';

    // Verificar si es el personaje correcto antes de eliminarlo del listado
    if (character.name === answer.name) {
        setMessage('¡Felicidades! Has adivinado el personaje.');
        guessInput.disabled = true;
        submitGuessButton.disabled = true;
        confettiEffect(); // Llamar a la función de confeti si adivina correctamente
    } else {
        // Eliminar el personaje del listado solo si no es el personaje correcto
        const index = characters.indexOf(character);
        if (index !== -1) {
            characters.splice(index, 1);
        }
    }
}

// Función para determinar si hay coincidencia entre dos arrays
function getMatchArray(guessArray, answerArray) {
    const intersection = guessArray.filter(item => answerArray.includes(item));
    return intersection.length === guessArray.length ? 'correct' : 'incorrect';
}

// Función para mostrar mensajes
const messageDisplay = document.getElementById('message');
function setMessage(msg) {
    messageDisplay.textContent = msg;
}

// Función para determinar si hay coincidencia entre dos valores
function getMatch(guess, answer) {
    return guess === answer ? 'correct' : 'incorrect';
}

// Función para determinar si hay coincidencia parcial entre dos series de valores
function getMatchSeries(guessSeries, answerSeries) {
    const intersection = guessSeries.filter(series => answerSeries.includes(series));
    if (intersection.length > 0) {
        return intersection.length === guessSeries.length ? 'correct' : 'partial';
    }
    return 'incorrect';
}

// Función para el efecto de confeti
function confettiEffect() {
    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}
