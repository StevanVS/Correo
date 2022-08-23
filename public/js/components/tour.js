export default class Tour {
    intro = introJs();

    #asistantPosOne = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_uno'>`;
    #asistantPosTwo = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>`;

    constructor() {

        this.intro.setOptions({
            isActive: true, /*Si esta true, se mostrara el tutorial - false no se mostrara*/
            nextLabel: "Siguiente",
            prevLabel: "Atras",
            steps: [{
                title: "Bienvenida",
                intro: "Hola, ¡bienvenido! <br>Te estaba esperando. " + this.#asistantPosOne
            }, {
                title: "Introducción",
                intro: "Me presento... <br>Mi nombre es Alex y estaré aquí para ayudarte. " + this.#asistantPosOne
            }, {
                title: "Introducción",
                intro: "Primero que todo, daremos un breve recorrido para que te puedas familiarizar con el entorno. " + this.#asistantPosOne
            }, {
                element: document.querySelector(".header"),
                title: "Barra Superior",
                intro: "Como primer punto, tenemos la barra superior. Aquí podrás encontrar varias opciones del sistema. " + this.#asistantPosTwo
            }, {
                element: document.querySelector(".header__menu"),
                title: "Botón de menú lateral",
                intro: "Este botón se encargará de minimizar o desplegar la barra lateral. " + this.#asistantPosOne
            },/* {
                element: document.querySelector(".header__config"),
                title: "Botón de configuración",
                intro: "Aquí tendrás varias opciones para poder configurar el entorno. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_left'>"
            },*/ {
                element: document.querySelector("[data-submenu-btn]"),
                title: "Menú de Usuario y Configuración",
                intro: "Aquí podrás ver la información de esta cuenta, como tu nombre, correo o foto. Así como varias opciones para configurar el entorno <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_left'>"
            }, {
                element: document.querySelector(".nav"),
                title: "Barra lateral",
                intro: "Es un menú donde encontrarás funciones como redactar, bandeja de entrada, Papelera, entre otros. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_uno'>"
            }, {
                element: document.querySelector(".btn__redactar"),
                title: "Redactar Correo",
                intro: "Este botón abrirá una ventana en la cual podrás redactar un correo. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_uno'>"
            }, {
                element: document.querySelector(".nav__content"),
                title: "Opciones de Correo",
                intro: "Aquí encontraras todos los correos, desde los que enviarás, hasta los que recibirás. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>"
            }, {
                element: document.querySelector(".emails-rows"),
                title: "Correos",
                intro: "En este espacio encontrarás el listado de tus correos. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>"
            }, {
                element: document.querySelector(".calendar-container"),
                title: "Agenda",
                intro: "¿Una agenda? Si, hemos colocado una agenda, para que puedas agendar eventos una vez te llegue un correo. <img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>"
            }
            ]
        })
    }

    start() {
        this.intro.start();
    }

    exit() {
        this.intro.exit();
    }

    onCompleteAndExit(callback) {
        this.intro.oncomplete(callback);

        this.intro.onexit(callback);
    }
}

