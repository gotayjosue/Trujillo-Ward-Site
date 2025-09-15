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

//Creating activities list

const activityContainer = document.querySelector('.calendar')
let ALL_ACTIVITIES = [] // Global variable to store all activities

function displayActivities(list){
    list.forEach( activity => {

        function monthNames(monthNumber){
            const monthsOfYear = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 
                'August', 'September', 'October', 'November', 'December'
              ];
            return monthsOfYear[monthNumber - 1]
        }

        const activityMonth = parseInt(activity.date.split('-')[1])
        const activityDay = activity.date.split('-')[2]
        const activityYear = activity.date.split('-')[0]
        
        const div = document.createElement('div')
        const h3 = document.createElement('h3')
        const date = document.createElement('p')
        const time = document.createElement('p')
        const reponsible = document.createElement('p')
        const img = document.createElement('img')

        h3.textContent = activity.activity
        date.innerHTML = `<strong>Date:</strong> ${activityDay} ${monthNames(activityMonth)} ${activityYear}`
        time.innerHTML = `<strong>Time:</strong> ${activity.time}`
        reponsible.innerHTML = `<strong>Responsible:</strong> ${activity.responsible}`
        img.src = 'images/activities.webp'
        img.alt = 'Activity Icon'

        div.appendChild(img)
        div.appendChild(h3)
        div.appendChild(date)
        div.appendChild(time)
        div.appendChild(reponsible)
        

        activityContainer.appendChild(div)

        div.style.cursor = "pointer"
        //Adding the click event to the activity container. Every it is clicked it leads to the details page
        div.addEventListener('click', () => {
            window.location.href = "/details"
        })
        //Sending data to the local storage in form of  json to the details page. This data will be retrieved later.
        div.addEventListener('click', () =>{
            localStorage.setItem('selectedActivity', JSON.stringify(activity))
            window.location.href = "/details"
        });

        if(activity.completed === true){

            div.style.background = "#6b9080"
            div.style.color = "white"
            img.style.filter = "invert(1)"
            div.style.border = "none"
    
            const advice = document.createElement('p')
            advice.textContent = "Completed✅"
            div.appendChild(advice)
        }

    });
}

//Fetching the activities from the api endpoint
async function loadActivities() {
  try {
    const res = await fetch("/api/activities", { credentials: "same-origin" });
    const data = await res.json();
    ALL_ACTIVITIES = data; // Store all activities globally
    displayActivities(ALL_ACTIVITIES); 
    attachFilters(); // Attach filter event listeners after loading activities
  } catch (err) {
    console.error("No se pudieron cargar actividades", err);
    activityContainer.innerHTML = "<p>No se pudieron cargar las actividades.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadActivities);


//Defining the reset function to clear the activity container to show the filtered content
function reset(){
    activityContainer.innerHTML = ''
}



/* filter by month and by organization function */

function applyFilters() {
  const monthVal = document.querySelector("#month").value; // "all" o "2"/"02"
  const orgVal   = document.querySelector("#org").value;   // "all" o "men", etc.

  let filtered = ALL_ACTIVITIES;

  // --- Filtro por mes ---
  if (monthVal !== "all") {
    // normaliza para evitar problemas "2" vs "02"
    const target = String(parseInt(monthVal, 10)); 
    filtered = filtered.filter(a => {
      const m = String(parseInt(a.date.split("-")[1], 10)); // "YYYY-**MM**-DD"
      return m === target;
    });
  }

  // --- Filtro por organización ---
  if (orgVal !== "all") {
    filtered = filtered.filter(a => a.org === orgVal);
  }

  reset();
  displayActivities(filtered);
}

function attachFilters() {
  document.querySelector("#month").addEventListener("change", applyFilters);
  document.querySelector("#org").addEventListener("change", applyFilters);
}

// Hide sticky button if header or footer is visible
const addBtnContainer = document.getElementById('addActivityBtnContainer');
const header = document.getElementById('mainHeader');
const footer = document.getElementById('mainFooter');

function toggleAddBtn(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      addBtnContainer.classList.add('hide');
    } else {
      addBtnContainer.classList.remove('hide');
    }
  });
}

const observerOptions = {
  root: null,
  threshold: 0
};

const headerObserver = new IntersectionObserver(toggleAddBtn, observerOptions);
const footerObserver = new IntersectionObserver(toggleAddBtn, observerOptions);

headerObserver.observe(header);
footerObserver.observe(footer);




