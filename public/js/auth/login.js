const loginForm = document.querySelector('[data-login-form]');
const emailInput = document.querySelector('[data-email-login-input]');
const passwordInput = document.querySelector('[data-password-login-input]');

loginForm.onsubmit = (e) => {
    e.preventDefault();
    
    const data = {
        email_address: emailInput.value,
        password: passwordInput.value,
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        
        if (this.responseText) {
            // COSA BUENA
            // console.log(JSON.parse(this.responseText));
            // currentUser = JSON.parse(this.responseText);
            window.location.href = '/'
        } else {
            //MALO
            alert('Credenciales Incorrectas')
        }
    }

    req.onerror = function (e) {
        console.log(e);
    }

    req.open('post', '/login');
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));
}

