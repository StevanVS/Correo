import AsistantModal from "./modals/asistantModal.js";

export default class Asistant {
    static asistant = document.querySelector(".asistente");
    asistantModal = new AsistantModal();

    static isActive = false;

    positionOne = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_uno'>`;
    positionTwo = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>`;


    constructor() {
        this.toggleAsistantBtn = document.querySelector('[data-toggle-asistant]');
        this.btnText = this.toggleAsistantBtn.querySelector('span');
        this.toggleAsistantBtn.onclick = () => {
            if (Asistant.isActive) {
                this.btnText.textContent = 'Activar Asistente';
                Asistant.hide();
                Asistant.isActive = !Asistant.isActive;
            } else {
                this.btnText.textContent = 'Desactivar Asistente';
                Asistant.isActive = !Asistant.isActive;
                Asistant.show();
            }
        }


        this.init();
    }

    static asistantEl() {
        const img = document.createElement('img');
        img.src = '../img/Robot_Final(Saludo).gif';
        img.classList.add('asistente_intro');
        img.style.right = '-150px';
        img.style.bottom = 0;
        if (Asistant.isActive) return img;
        else return document.createElement('div')
    }

    static show() {
        if (!Asistant.isActive) return;
        Asistant.asistant.style.display = 'block';
    }

    static hide() {
        // if (!this.isActive) return;
        Asistant.asistant.style.display = 'none';
    }

    init() {
        const asistente = document.querySelector(".asistente");

        asistente.onmousedown = function (event) {
            let shiftX = event.clientX - asistente.getBoundingClientRect().left;
            let shiftY = event.clientY - asistente.getBoundingClientRect().top;

            asistente.style.position = 'absolute';
            asistente.style.zIndex = 1000;
            document.body.append(asistente);

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                asistente.style.left = pageX - shiftX + 'px';
                asistente.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            asistente.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                asistente.onmouseup = null;
            };
        };

        asistente.ondragstart = function () {
            return false;
        };


        let drag = false;
        asistente.addEventListener('mousedown', () => drag = false);

        asistente.addEventListener('mousemove', () => drag = true);

        asistente.addEventListener('mouseup', () => {
            // console.log(drag ? 'drag' : 'click')
            if (drag) return;

            this.asistantModal.show();


        });
    }

    static getRect() {
        return this.asistant.getBoundingClientRect();
    }
}