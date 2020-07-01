const resultsDOM = document.querySelector('.results');
// const cardsDisplay = document.querySelector('.cards__display');
const form = document.querySelector('.weather__form');
const errorMessage = document.querySelector('.error');
let oldCity = '';

// If this key does not work create your own at https://home.openweathermap.org/sign_up
const key = 'd0f644e145aa675c160293158319319d';

// Get city
async function getWeatherAW(city) {
    try {
        // const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`);
        const result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`);
        const data = await result.json(); 
        
        return data;
    } catch(error) {
              alert(error)
    }
}

const clearResult = () => {
    resultsDOM.innerHTML = '';
}

form.addEventListener("submit", (e) => {
    // Prevents the default form submission action...
    e.preventDefault();
    
    // User Inputs a city
    const city = document.querySelector('#weather__search').value;
   
    // Check that the city isn't being used already/displayed or is a new city
    if (city || city !== oldCity) {
        // If an message error exists... clear it out on next load
        errorMessage.innerHTML = null;
        // Once they select a new city, delete the previous city from the display
        if (oldCity){
            clearResult();
        }
    }
    getWeatherAW(city).then(data => {
        let curDate = new Date();
        let curTime;
        // API does the time every 3 hours, sets the time if in the window
        if (curDate.getHours() % 3 === 0) {
            curTime = `${curDate.getHours()}:00:00`;
        } else {
            // If it isnt in the 3 hour window, it will be set to whatever is the last 3 hour window was
            curTime = curDate.getHours() - (curDate.getHours() % 3)
        }
        let fiveDayForecast = data.list.filter(el => el.dt_txt.includes(curTime));

        const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Get city
        let cityName = `<h2 class="city__name">${city}</h2>`;

        // Create an array of cards, one for each day of the week
        let mark = fiveDayForecast.map(el => `            
            <div class="card">
                <h3 class="current__date">${week[new Date(el.dt_txt.slice(0,10)).getDay()]}</h3>
                <h3 class="city__temp">${el.main.temp} &deg;F</h3>
                <h3 class="city__weather">${el.weather[0].description}</h3>
                <img class="city__icon" src="http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png" alt="">
            </div> 
        `);

        const markup = `
            <div class="results__display">
                ${cityName}
                <div class="cards__display">
                    ${mark.join("")}       
                </div>
            </div> 
        `
        resultsDOM.insertAdjacentHTML('beforeend', markup);
    }).catch(()=>{
     
        // Invalid city entered
            errorMessage.innerHTML = 'Please enter a valid city. (City, Country)';
    });
    
    // Update the previous city so it could check above if it exists when ran again.
    oldCity = city;  
});












