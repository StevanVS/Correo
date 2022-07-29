const singupForm = document.querySelector('[data-singup-form]');
const nameSingupInput = document.querySelector('[data-name-singup-input]');
const lastnameSingupInput = document.querySelector('[data-lastname-singup-input]');
const emailSingupInput = document.querySelector('[data-email-singup-input]');
const passwordSingupInput = document.querySelector('[data-password-singup-input]');

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