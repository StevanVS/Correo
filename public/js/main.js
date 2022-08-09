
const btn_redactar = document.querySelector(".btn__redactar");
const modal = document.querySelector(".email");
const modal_box = document.querySelector(".email__modal");
const exit_redactar = document.querySelector(".exit");
const btn_minimize = document.querySelector(".btn_minimize");
const form_minimize = document.querySelector(".email__form");
const menubtn = document.querySelector(".header__menu");
const nav = document.querySelector(".nav");
const btn__redactar = document.querySelector(".btn__redactar");
const icon__redactar = document.querySelector(".icon__redactar");
const emails = document.querySelector(".emails");



btn_redactar.addEventListener("click", () => {
    modal.classList.toggle("active");
});

exit_redactar.addEventListener("click", () => {
    modal.classList.toggle("active");
});

btn_minimize.addEventListener("click", () => {
    alterElementClass([
        modal,
        modal_box,
        form_minimize
    ], 'toggle', 'minimize');
});

menubtn.addEventListener("click", () => {
    menuBtnEvent('toggle');
});

export function menuBtnEvent(action) {
    alterElementClass([
        nav,
        btn__redactar,
        icon__redactar,
        [...document.querySelectorAll('.nav__item')],
        emails
    ], action, 'active');
}

function alterElementClass(elements, action, className) {
    elements = elements.flat(Infinity);
    elements.forEach(element => {
        element.classList[action](className);
    });
}
