
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

const config_btn = document.querySelector(".header__config");
const submenu_content = document.querySelector(".submenu");


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


let isSubMenuActive = false;

document.addEventListener('mouseup', function (e) {
    if (!submenu_content.contains(e.target)) {
        submenu_content.classList.remove("active");
        config_btn.classList.remove("active");
        isSubMenuActive = false
    }
})

config_btn.addEventListener("click", () => {
    if (!isSubMenuActive) {
        submenu_content.classList.add("active");
        config_btn.classList.add("active");
        isSubMenuActive = true;
    } else {
        submenu_content.classList.remove("active");
        config_btn.classList.remove("active");
        isSubMenuActive = false;
    }
})
