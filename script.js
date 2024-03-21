//recupero gli elementi di interesse dalla pagina

const htmlElement = document.documentElement;
const suggestion = document.querySelector('.suggestion');
const weatherIcon = document.querySelector('.weather-icon');
const weatherLocation = document.querySelector('.weather-location');
const weatherTemperature = document.querySelector('.weather-temperature');
const themeIcon = document.querySelector('.theme__icon');
const rootCSS = document.querySelector(':root');
const usrInput = document.getElementById('usr_Input');
const buttonSearch = document.getElementById('__button__search');


let theme = 'light';

navigator.geolocation.getCurrentPosition(onSuccess, onError);
buttonSearch.addEventListener('click', function(){
    onSearch(usrInput.value);
});

function changeTheme() {
    if (theme == 'light') {
        theme = 'dark';
        rootCSS.style.setProperty('--background', 'black');
        rootCSS.style.setProperty('--panel', '#f700ff46');
        rootCSS.style.setProperty('--text', '#ffffff');
        themeIcon.style.setProperty('filter', 'invert(1)')
    } else {
        theme = 'light'
        rootCSS.style.setProperty('--background', '#aa98ff');
        rootCSS.style.setProperty('--panel', '#c4c9e7');
        rootCSS.style.setProperty('--text', '#000000');
        themeIcon.style.setProperty('filter', 'invert(0)')
    }
}

themeIcon.addEventListener('click', function(){
    changeTheme();
});

//funzione da eseguire in caso di error
function onError(){
    //Preparo degli elementi in pagina per far capire che va attivata
    weatherLocation.innerText = '';
    weatherIcon.alt='Geolocation disattivata';
    weatherIcon.src='./images/geolocation_disabled.png'
    suggestion.innerText = 'Attiva la geolocalizzazione';
    //  disattivare il loading
    htmlElement.className = '';
}


async function onSuccess(position) {
    console.log(position);

    // recupero latitudine e longitudine
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const units = 'metric'
    const lang = 'it'
    console.log(latitude, longitude);

    // prepariamoci a chiama l'api do open weather 
    const API_KEY = OPENWEATHER_API_KEY;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}&lang=${lang}`

    // chiamo API di open weather
    const response = await fetch(endpoint);
    const data = await response.json();

    console.log(data);
 
    const iconCode = data.weather[0].icon;
    const description = data.weather[0].description;

    //riempio gli element della pagina
    weatherLocation.innerText = data.name;
    weatherIcon.alt = description;
    weatherIcon.src = `images/${iconCode}.png`
    //  disattivare il loading
    weatherTemperature.innerText = `${Math.floor(data.main.temp)}º`;
    console.log(weatherTemperature, data.main.temp, Math.floor(data.main.temp))
    suggestion.innerText = getSuggestion(iconCode);

    htmlElement.className = '';
}

//funzione per decidere il suggerimento appropriato
function getSuggestion(iconCode) {
    return suggestions[iconCode];
}


async function onSearch(usrInputText) {
    
    const geocodeKey = GEOCODE_API_KEY;
    
    const urlGeocoding = `https://geocode.maps.co/search?q=${usrInputText}&api_key=${geocodeKey}`
    const responseUsr = await fetch(urlGeocoding);
    const dataUsr = await responseUsr.json();
    console.log(dataUsr);

    // recupero latitudine e longitudine
    const latitude = dataUsr[0].lat;
    const longitude = dataUsr[0].lon;
    const display = dataUsr[0].display_name;
    const units = 'metric'
    const lang = 'it'
    console.log(display, latitude, longitude);

    // prepariamoci a chiama l'api do open weather 
    const API_KEY = OPENWEATHER_API_KEY
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}&lang=${lang}`

    // chiamo API di open weather
    const response = await fetch(endpoint);
    const data = await response.json();

    console.log(data);
 
    const iconCode = data.weather[0].icon;
    const description = data.weather[0].description;

    //riempio gli element della pagina
    weatherLocation.innerText = data.name;
    weatherIcon.alt = description;
    weatherIcon.src = `images/${iconCode}.png`
    //  disattivare il loading
    weatherTemperature.innerText = `${Math.floor(data.main.temp)}º`;
    suggestion.innerText = getSuggestion(iconCode);

    htmlElement.className = '';
}

