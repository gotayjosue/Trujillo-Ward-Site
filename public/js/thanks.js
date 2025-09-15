const currentUrl = window.location.href;
console.log(currentUrl)

//Divide the url into two halves

const everything = currentUrl.split('?')
let formData = everything[1].split('&')

function show(cup){
    formData.forEach((element) => {

        if (element.startsWith(cup)){
            result = element.split('=')[1].replace(/%40|\+|%2F|%3A/g, match => 
                match === '%40' ? '@' : 
                match === '+' ? ' ' : 
                match === '%2F' ? '/' :
                ':' );
        }
    })
    return (result)
}

const showInfo = document.querySelector('#formData')
showInfo.innerHTML = `
<p><strong>Name: </strong>${show('first')} ${show('last')}</p>
<p><strong>Gender: </strong>${show('gender')}</p>
<p><strong>Your email: </strong><a href="">${show('email')}</a></p>
<p><strong>Your Phone: </strong>${show('phone')}</p>
<p><strong>Comments: </strong>${show('comment')}`