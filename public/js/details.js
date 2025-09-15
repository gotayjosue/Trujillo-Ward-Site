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

//Everytime the page gets bigger the class 'open' will be take out of the navBar and the menuButton//
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) { 
        navBar.classList.remove('open');
        menuButton.classList.remove('open')
    }
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

const detailsContainer = document.querySelector('.activityDetails')
const photoGallery = document.querySelector('.gallery')


document.addEventListener('DOMContentLoaded', () =>{

    const selectedActivity = JSON.parse(localStorage.getItem('selectedActivity')); /*This line here retrieve the data of the photo the user clicked on the home page*/
  
    if (selectedActivity){

        function monthNames(monthNumber){
            const monthsOfYear = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 
                'August', 'September', 'October', 'November', 'December'
              ];
            return monthsOfYear[monthNumber - 1]
        }

        const photos = selectedActivity.photos || []; // This is the "photos" array in the json file
        const message = document.querySelector('.message') // If there are no photos this message will appear
        const activityMonth = parseInt(selectedActivity.date.split('-')[1])
        const activityDay = selectedActivity.date.split('-')[2]
        const activityYear = selectedActivity.date.split('-')[0]

        const p1 = document.createElement('p')
        const p2 = document.createElement('p')
        const location = document.createElement('p')
        const date = document.createElement('p')
        const time = document.createElement('p')
        const responsible = document.createElement('p')
        const organization = document.createElement('p')

        p1.innerHTML = `<strong>Activity: </strong>${selectedActivity.activity}`

        if(selectedActivity.completed === false){
            p2.innerHTML = `<strong>Status: </strong>Pending`
        }else{
            p2.innerHTML = `<strong>Status: </strong>Completed`
        }

        location.innerHTML = `<strong>Location: </strong>${selectedActivity.location}`
        date.innerHTML = `<strong>Date:</strong> ${activityDay} ${monthNames(activityMonth)} ${activityYear}`
        time.innerHTML = `<strong>Time:</strong> ${selectedActivity.time}`
        responsible.innerHTML = `<strong>Responsible:</strong> ${selectedActivity.responsible}`

        if(selectedActivity.org === 'kids'){
            organization.innerHTML = `<strong>Organization:</strong> Primary`
        }
        if(selectedActivity.org === 'women'){
            organization.innerHTML = `<strong>Organization:</strong> Relief Society`
        }
        if(selectedActivity.org === 'men'){
            organization.innerHTML = `<strong>Organization:</strong> Elders Cuorum`
        }
        if(selectedActivity.org === 'youngMen'){
            organization.innerHTML = `<strong>Organization:</strong> Young Men`
        }
        if(selectedActivity.org === 'youngWomen'){
            organization.innerHTML = `<strong>Organization:</strong> Young Women`
        }
        if(selectedActivity.org === 'forAll'){
            organization.innerHTML = `<strong>Organization:</strong> For all members`
        }

        //Conditions for photo's array: If the photo array is empty it will show a message, if it's not it will show the photos
        photos.forEach(photo => {
            
            if (!photo.url || photo.url === ''){
                message.style.display = 'block'
            }else{
                message.style.display = 'none'

                const img = document.createElement('img')

                img.src = photo.url
                img.loading = 'lazy'

                photoGallery.appendChild(img)
            }
        });

        detailsContainer.appendChild(p1)
        detailsContainer.appendChild(p2)
        detailsContainer.appendChild(location)
        detailsContainer.appendChild(date)
        detailsContainer.appendChild(time)
        detailsContainer.appendChild(responsible)
        detailsContainer.appendChild(organization)
    }

  const deleteBtn = document.getElementById('deleteBtn');
  const updateBtn = document.getElementById('updateBtn');
  const confirmModal = document.getElementById('confirmModal');
  const confirmYes = document.getElementById('confirmYes');
  const confirmNo = document.getElementById('confirmNo');

  if (selectedActivity) {
    deleteBtn.addEventListener('click', () => {
      confirmModal.style.display = 'flex';
    });

    confirmYes.addEventListener('click', async () => {
    confirmModal.style.display = 'none';
    const response = await fetch(`/api/activities/${selectedActivity._id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      showToast('Activity deleted!');
      setTimeout(() => window.location.href = '/activities', 2000);
    } else {
      showToast('Error deleting activity.');
    }
  });

  confirmNo.addEventListener('click', () => {
    confirmModal.style.display = 'none';
  });

  updateBtn.addEventListener('click', () => {
    window.location.href = `/activities/${selectedActivity._id}/edit`;
  });
}

});





