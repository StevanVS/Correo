const singupForm = document.querySelector('[data-singup-form]');
const nameSingupInput = document.querySelector('[data-name-signup-input]');
const lastnameSingupInput = document.querySelector('[data-lastname-signup-input]');
const emailSingupInput = document.querySelector('[data-email-signup-input]');
const passwordSingupInput = document.querySelector('[data-password-signup-input]');

singupForm.onsubmit = (e) => {
    e.preventDefault();

    const data = {
        name: nameSingupInput.value,
        lastname: lastnameSingupInput.value,
        email_address: emailSingupInput.value,
        password: passwordSingupInput.value
    }

    const req = new XMLHttpRequest();
    req.onload = function () {
        window.location.href = '/login';
    }

    req.onerror = function (e) {
        console.log(e);
    }

    req.open('post', '/api/users', true);
    req.setRequestHeader('Content-type', 'application/json')
    req.send(JSON.stringify(data));

}