import Alert from "../components/alert.js";

const loginForm = document.querySelector("[data-login-form]");
const emailInput = loginForm.email;
const passwordInput = loginForm.password;

const singupForm = document.querySelector("[data-singup-form]");
const nameSingupInput = document.querySelector("[data-name-singup-input]");
const lastnameSingupInput = document.querySelector(
    "[data-lastname-singup-input]"
);
const emailSingupInput = document.querySelector("[data-email-singup-input]");
const passwordSingupInput = document.querySelector(
    "[data-password-singup-input]"
);

loginForm.onsubmit = (e) => {
    e.preventDefault();

    const data = {
        type: "login",
        email_address: emailInput.value.trim(),
        password: passwordInput.value.trim(),
    };

    const req = new XMLHttpRequest();
    req.onload = function () {
        const response = JSON.parse(this.responseText);
        if (response.success) {
            window.location.href = "/";
        } else {
            // new Alert('Credenciales Incorrectas', 'error');
            passwordInput.value = "";
            setErrorFor(emailInput, "Correo o contraseña Incorrecto");
            emailInput.focus();
        }
    };

    req.onerror = function (e) {
        console.log(e);
    };

    req.open("post", "/login-singup");
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(data));
};

singupForm.onsubmit = (e) => {
    e.preventDefault();

    let error = false;

    const email = emailSingupInput.value.trim();
    const pass = passwordSingupInput.value.trim();

    // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
    if (!/@imail\./g.test(email)) {
        setErrorFor(
            emailSingupInput,
            'El dominio del correo debe ser "@imail"'
        );
        emailSingupInput.focus();
        error = true;
    } else if (!/@imail\.[\w-]{2,4}$/g.test(email)) {
        setErrorFor(
            emailSingupInput,
            "Falta el tipo de dominio al final, Ej.: .com"
        );
        emailSingupInput.focus();
        error = true;
    } else {
        setSuccessFor(emailSingupInput);
    }

    if (pass.length < 8) {
        setErrorFor(
            passwordSingupInput,
            "La contraseña debe tener mínimo 8 caracteres"
        );
        error = true;
    } else if (pass.length > 20) {
        setErrorFor(
            passwordSingupInput,
            "La contraseña debe tener máximo 20 caracteres"
        );
        error = true;
    } else {
        setSuccessFor(passwordSingupInput);
    }

    if (error) return;

    const data = {
        type: "singup",
        name: nameSingupInput.value.trim(),
        lastname: lastnameSingupInput.value.trim(),
        email_address: email,
        password: pass,
    };

    const req = new XMLHttpRequest();
    req.onload = function () {
        const response = JSON.parse(this.responseText);
        if (!response.error) {
            window.location.href = "/";
        } else {
            setErrorFor(emailSingupInput, response.error);
            // new Alert(response.error, 'error')
        }
    };

    req.onerror = function (e) {
        console.log(e);
    };

    req.open("post", "/login-singup", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(data));
};

emailSingupInput.onfocus = () => {
    if (emailSingupInput.value.trim().length === 0) {
        setInfoFor(
            emailSingupInput,
            `Ejemplo de correo: ${generateEmail() || "juanga23@imail.com"} `
        );
    } else {
        removeClassFor(emailSingupInput, "info");
    }
};
passwordSingupInput.onfocus = () => {
    if (passwordSingupInput.value.trim().length === 0) {
        setInfoFor(
            passwordSingupInput,
            "Ingrese una contraseña con más de 8 caracteres"
        );
    } else {
        removeClassFor(passwordSingupInput, "info");
    }
};

function setErrorFor(input, msg) {
    const form = input.parentElement;
    const span = form.querySelector("span");

    span.textContent = msg;

    form.classList.add("error");
    form.classList.remove("info");
}

function setSuccessFor(input) {
    const form = input.parentElement;
    form.classList.remove("error");
    form.classList.remove("info");
}

function setInfoFor(input, msg) {
    const form = input.parentElement;
    const span = form.querySelector("span");

    span.textContent = msg;

    form.classList.add("info");
    form.classList.remove("error");
}

function removeClassFor(input, className) {
    const form = input.parentElement;
    form.classList.remove(className);
}

function generateEmail() {
    if (
        nameSingupInput.value.trim().length < 3 ||
        lastnameSingupInput.value.trim().length < 2
    )
        return;

    const name = nameSingupInput.value.toLowerCase();
    const lastname = lastnameSingupInput.value.toLowerCase();
    const number = new Date().getTime().toString().slice(-3, -1)

    return `${name.slice(0, 4)}${lastname.slice(0, 2)}${number}@imail.com`;
}
