
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
const navItems = document.querySelectorAll('.nav__item');

const submenuBtn = document.querySelector("[data-submenu-btn]");
const submenu_content = document.querySelector(".submenu");


// btn_minimize.addEventListener("click", () => {
//     alterElementClass([
//         modal,
//         modal_box,
//         form_minimize
//     ], 'toggle', 'minimize');
// });

menubtn.addEventListener("click", () => {
    menuBtnEvent('toggle');
});

export function menuBtnEvent(action) {
    alterElementClass([
        nav,
        btn__redactar,
        icon__redactar,
        [...navItems],
        emails
    ], action, 'active');
}

function alterElementClass(elements, action, className) {
    elements = elements.flat(Infinity);
    elements.forEach(element => {
        element.classList[action](className);
    });
}

export function expandNav() {
    menuBtnEvent('remove');
}

export function reduceNav() {
    menuBtnEvent('add');
}

export function handleConfigMenuClose(e) {
    if (
        !submenu_content.contains(e.target) && 
        !submenuBtn.contains(e.target)
    ) {
        submenu_content.classList.remove("active");
        submenuBtn.classList.remove("active");
    }
}

export function handleNavClose(e) {
    if (
        !nav.contains(e.target) &&
        !menubtn.contains(e.target) &&
        window.innerWidth < 1024
    ) reduceNav();
}

submenuBtn.addEventListener("click", () => {
    submenu_content.classList.toggle("active");
    submenuBtn.classList.toggle("active");
})
