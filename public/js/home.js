

//Getting the full year
const year = document.querySelector('#year')
const fullYear = new Date().getFullYear()

year.textContent = fullYear

//Menu button functionalities
const menuButton = document.querySelector('#menuButton')
const navBar = document.querySelector('#navigation')

menuButton.addEventListener('click', () =>{

    navBar.classList.toggle('open')
    menuButton.classList.toggle('open')
})


window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) { //Everytime the page gets bigger the class 'open' will be take out of the navBar and the menuButton//
        navBar.classList.remove('open');
        menuButton.classList.remove('open')
    }
});

//API call implementation

const url= window.WEATHER_API_URL;

const weatherContainer = document.querySelector('.weather')

async function apiFetch() {
    
    try{
        const response = await fetch(url);
        if(response.ok){
            const data = await response.json()
            console.log(data)
            displayResults(data)
        }else{
            throw Error(await response.text())
            
        }
    } catch (error){
        console.log(error);
    }


}
apiFetch()

function displayResults(data){

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const icon = document.createElement('img')
    icon.setAttribute('src', iconUrl)
    icon.setAttribute('alt', data.weather[0].description)
    weatherContainer.appendChild(icon)
    const temp = document.createElement('p')
    temp.innerHTML = `<strong>${data.main.temp}</strong> ºC`
    weatherContainer.appendChild(temp)
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const description = document.createElement('p')
    description.textContent = capitalize(data.weather[0].description)
    weatherContainer.appendChild(description)
};
//Activities spotlight function
const currentMonth = new Date().getMonth() + 1 //This way months start in 1 instead of 0
const spotlighContainer = document.querySelector('.spotlight')

//Info containers options
const calendarInfo = document.querySelector('.calendar')
const directoryInfo = document.querySelector('.directory')
const knowUsInfo = document.querySelector('.group')

calendarInfo.style.cursor = 'pointer'
directoryInfo.style.cursor = 'pointer'
knowUsInfo.style.cursor = 'pointer'

calendarInfo.addEventListener('click', () =>{
    window.location.href = '/activities'
})

directoryInfo.addEventListener('click', () =>{
    window.location.href = '/directory'
})

knowUsInfo.addEventListener('click', () =>{
    window.location.href = '/contact'
})

let ALL_ACTIVITIES = [] //Global variable to store all activities

function displaySpotlight(activities){

    const filteredMembers = activities.filter(activity => parseInt(activity.date.split('-')[1]) >= currentMonth 
    && parseInt(activity.date.split('-')[1]) <= currentMonth + 3)

    const selectedRandom = selected(filteredMembers, 3)

    selectedRandom.forEach(activity => {

        function monthNames(monthNumber){
            const monthsOfYear = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 
                'August', 'September', 'October', 'November', 'December'
              ];
            return monthsOfYear[monthNumber - 1]
        }

        const activityYear = activity.date.split('-')[0]
        const activityMonth = parseInt(activity.date.split('-')[1])
        const activityDay = activity.date.split('-')[2]

        const div = document.createElement('div')
        const img = document.createElement('img')
        const h4 = document.createElement('h4')
        const date = document.createElement('p')
        const time = document.createElement('p')
        const status = document.createElement('p')

        img.src = "images/spotlight.webp"
        img.alt = "Spotlight Icon"
        img.loading = 'lazy'
        div.style.cursor = 'pointer'
        

        h4.textContent = activity.activity
        date.textContent = `${activityDay} ${monthNames(activityMonth)} ${activityYear}`
        time.textContent = activity.time
        if (activity.completed === false){
            status.innerHTML = `<strong>Status:</strong> Pending`
        }else{
            status.innerHTML = `<strong>Status:</strong> Completed`
        }

        div.addEventListener('click', () =>{
            window.location.href = '/details'
        })

        div.addEventListener('click', () =>{
            localStorage.setItem('selectedActivity', JSON.stringify(activity))
            window.location.href = '/details'
        })

        div.appendChild(img)
        div.appendChild(h4)
        div.appendChild(date)
        div.appendChild(time)
        div.appendChild(status)

        spotlighContainer.appendChild(div)

    });
}

//Fetching the activities from the api endpoint
async function loadActivities() {
  try {
    const res = await fetch("/api/activities", { credentials: "same-origin" });
    const data = await res.json();
    ALL_ACTIVITIES = data; // Store all activities globally
    displaySpotlight(ALL_ACTIVITIES); 
  } catch (err) {
    console.error("No se pudieron cargar actividades", err);
    activityContainer.innerHTML = "<p>No se pudieron cargar las actividades.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadActivities);


function selected (members, n){
    const result = []
    const copy = [...members]
    while (result.length < n && copy.length > 0){
        const ramdomSelection = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(ramdomSelection, 1)[0]);
    }
    return result;
}