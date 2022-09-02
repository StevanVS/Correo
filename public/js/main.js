import breakPoints from "./utils/breakPoints.js";

const menubtn = document.querySelector(".header__menu");
const nav = document.querySelector(".nav");
const btn__redactar = document.querySelector(".btn__redactar");
const icon__redactar = document.querySelector(".icon__redactar");
const emails = document.querySelector(".emails");
const navItems = document.querySelectorAll('.nav__item');

const submenuBtn = document.querySelector("[data-submenu-btn]");
const submenu_content = document.querySelector(".submenu");


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


let isNavExpanded = true;

export function updateNavSize() {
    const width = window.innerWidth;
    if (width > breakPoints.large) {
        if (!isNavExpanded) {
            expandNav();
            isNavExpanded = !isNavExpanded;
        }
    } else if (isNavExpanded) {
        reduceNav();
        isNavExpanded = !isNavExpanded;
    }
}

export function handleConfigMenuClose(e) {
    if (
        !submenu_content.contains(e.target) && 
        !submenuBtn.contains(e.target)
    ) {
        closeSubMenu();
        submenuBtn.classList.remove("active");
    }
}

export function closeSubMenu() {
    submenu_content.classList.remove("active");
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
