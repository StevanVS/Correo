import Alert from "../components/alert.js";

const loginForm = document.querySelector('[data-login-form]');
const emailInput = document.querySelector('[data-email-login-input]');
const passwordInput = document.querySelector('[data-password-login-input]');

const singupForm = document.querySelector('[data-singup-form]');
const nameSingupInput = document.querySelector('[data-name-singup-input]');
const lastnameSingupInput = document.querySelector('[data-lastname-singup-input]');
const emailSingupInput = document.querySelector('[data-email-singup-input]');
const passwordSingupInput = document.querySelector('[data-password-singup-input]');

loginForm.onsubmit = (e) => {
    e.preventDefault();

    const data = {
        type: 'login',
        email_address: emailInput.value,
        password: passwordInput.value,
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        if (this.responseText) {
            // COSA BUENA
            window.location.href = '/'
        } else {
            //MALO
            // alert('Credenciales Incorrectas')
            new Alert('Credenciales Incorrectas', 'danger')
        }
    }

    req.onerror = function (e) {
        console.log(e);
    }

    req.open('post', '/login-singup');
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));
}

singupForm.onsubmit = (e) => {
    e.preventDefault();

    const data = {
        type: 'singup',
        name: nameSingupInput.value,
        lastname: lastnameSingupInput.value,
        email_address: emailSingupInput.value,
        password: passwordSingupInput.value
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        window.location.href = '/';
    }

    req.onerror = function (e) {
        console.log(e);
    }

    req.open('post', '/login-singup', true);
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));
}