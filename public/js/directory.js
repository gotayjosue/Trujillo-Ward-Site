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

//Modal dialogues


    //Open buttons
    const bishopricButton = document.querySelector('#bishopricOpen')
    const wardClerkOpen = document.querySelector('#wardClerkOpen')
    const executiveSecretaryOpen = document.querySelector('#exeSecOpen')
    const melchizedekPriesthoodOpen = document.querySelector('#melchizedekOpen')
    const reliefSocietyOpen = document.querySelector('#reliefOpen')
    const youngMenOpen = document.querySelector('#menOpen')
    const youngWomenOpen = document.querySelector('#womenOpen')
    const primaryOpen = document.querySelector('#primaryOpen')

    //Modals
    const bishopricModal = document.querySelector('#bishopric')
    const wardClerkModal = document.querySelector('#wardClerk')
    const exeSecretaryModal = document.querySelector('#exeSecretary')
    const melchizedekModal = document.querySelector('#melchizedek')
    const reliefSocietyModal = document.querySelector('#reliefSociety')
    const youngMenModal = document.querySelector('#youngMen')
    const youngWomenModal = document.querySelector('#youngWomen')
    const primaryModal = document.querySelector('#primary')


    //Close buttons
    const bishopricClose = document.querySelector('#bishopricClose')
    const wardClerkClose = document.querySelector('#wardClerkClose')
    const exeSecretaryClose = document.querySelector('#exeSecClose')
    const melchizedekClose = document.querySelector('#melchizedekClose')
    const reliefSocietyClose = document.querySelector('#reliefClose')
    const youngMenClose = document.querySelector('#menClose')
    const youngWomenClose = document.querySelector('#womenClose')
    const primaryClose = document.querySelector('#primaryClose')


modals(bishopricModal, bishopricButton, bishopricClose)
modals(wardClerkModal, wardClerkOpen, wardClerkClose)
modals(exeSecretaryModal, executiveSecretaryOpen, exeSecretaryClose)
modals(melchizedekModal, melchizedekPriesthoodOpen, melchizedekClose)
modals(reliefSocietyModal, reliefSocietyOpen, reliefSocietyClose)
modals(youngMenModal, youngMenOpen, youngMenClose)
modals(youngWomenModal, youngWomenOpen, youngWomenClose)
modals(primaryModal, primaryOpen, primaryClose)


//Function to open and close modal elements
function modals(modal, open, close){

    open.addEventListener('click', () =>{
        modal.showModal()
    })

    close.addEventListener('click', () =>{
        modal.close()
    })
}