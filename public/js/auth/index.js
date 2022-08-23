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
        email_address: emailInput.value.trim(),
        password: passwordInput.value.trim(),
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        const response = JSON.parse(this.responseText);
        if (response.success) {
            window.location.href = '/'
        } else {
            new Alert('Credenciales Incorrectas', 'error')
        }
    }

    req.onerror = function (e) { console.log(e) }

    req.open('post', '/login-singup');
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));
}

singupForm.onsubmit = (e) => {
    e.preventDefault();

    const email = emailSingupInput.value.trim();
    const pass = passwordSingupInput.value.trim();

    // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
    if (!/.[\w-]{2,4}$/g.test(email)) {
        setErrorFor(emailSingupInput, 
            'Falta el tipo de dominio al final, ej.: .com')
    } else {
        setSuccessFor(emailSingupInput)
    }


    if (pass.length < 8) {
        setErrorFor(passwordSingupInput,
            'La contraseña debe tener mínimo 8 caracteres');
        return;
    } else if (pass.length > 20) {
        setErrorFor(passwordSingupInput,
            'La contraseña debe tener máximo 20 caracteres');
        return;
    } else {
        setSuccessFor(emailSingupInput)
    }

    const data = {
        type: 'singup',
        name: nameSingupInput.value.trim(),
        lastname: lastnameSingupInput.value.trim(),
        email_address: email,
        password: pass
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        const response = JSON.parse(this.responseText)
        if (!response.error) {
            window.location.href = '/';
        } else {
            setErrorFor(emailSingupInput, 'Correo Invalido')
            new Alert(response.error, 'error')
        }
    }

    req.onerror = function (e) { console.log(e) }

    req.open('post', '/login-singup', true);
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));
}

function setErrorFor(input, msg) {
    const form = input.parentElement;
    const span = form.querySelector('span');

    span.textContent = msg;

    form.classList.add('error');
    form.classList.remove('success');
}

function setSuccessFor(input) {
    const form = input.parentElement;

    // form.classList.add('success');
    form.classList.remove('error');
}