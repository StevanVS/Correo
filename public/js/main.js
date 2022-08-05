(function () {

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
    // const nav__item1 = document.querySelector("#nav__content1");
    // const nav__item2 = document.querySelector("#nav__content2");
    // const nav__item3 = document.querySelector("#nav__content3");
    // const nav__item4 = document.querySelector("#nav__content4");
    const emails = document.querySelector(".emails");



    btn_redactar.addEventListener("click", () => {
        modal.classList.toggle("active");
    });

    exit_redactar.addEventListener("click", () => {
        modal.classList.toggle("active");
    });

    btn_minimize.addEventListener("click", () => {
        modal.classList.toggle("minimize");
        modal_box.classList.toggle("minimize");
        form_minimize.classList.toggle("minimize");
    });

    menubtn.addEventListener("click", () => {
        nav.classList.toggle("active");
        btn__redactar.classList.toggle("active");
        icon__redactar.classList.toggle("active");

        // nav__item1.classList.toggle("active");
        // nav__item2.classList.toggle("active");
        // // nav__item3.classList.toggle("active");
        // nav__item4.classList.toggle("active");

        document.querySelectorAll('.nav__item').forEach(item => item.classList.toggle('active'))

        emails.classList.toggle("active");

    });
})();