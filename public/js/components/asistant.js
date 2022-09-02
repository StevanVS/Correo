import breakPoints from "../utils/breakPoints.js";
import AsistantModal from "./modals/asistantModal.js";

export default class Asistant {
    static #LOCAL_STORAGE_ASISTANT_KEY = "imail.asistant";

    static asistant = document.querySelector(".asistente");
    asistantModal = new AsistantModal();

    static positionOne = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_uno'>`;
    static positionTwo = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_dos'>`;
    static positionLeft = `<img src='../img/Robot_Final(Saludo).gif' class='asistente_intro position_left'>`;

    constructor() {
        if (window.innerWidth < breakPoints.short) {
            Asistant.setActive(false);
            Asistant.hide();
        }

        this.toggleAsistantBtn = document.querySelector(
            "[data-toggle-asistant]"
        );
        this.btnText = this.toggleAsistantBtn.querySelector("span");

        if (Asistant.getActive()) {
            this.btnText.textContent = "Desactivar Asistente";
            Asistant.show();
        } else {
            this.btnText.textContent = "Activar Asistente";
            Asistant.hide();
        }

        this.toggleAsistantBtn.onclick = () => {
            if (Asistant.getActive()) {
                this.btnText.textContent = "Activar Asistente";
                Asistant.hide();
                Asistant.setActive(false);
            } else {
                this.btnText.textContent = "Desactivar Asistente";
                Asistant.setActive(true);
                Asistant.show();
            }
        };

        this.init();
    }

    static asistantEl() {
        if (!Asistant.getActive()) returndocument.createElement("div");

        const img = document.createElement("img");
        img.src = "../img/Robot_Final(Saludo).gif";
        img.classList.add("asistente_intro");
        img.style.right = "-150px";
        img.style.bottom = 0;
        return img;
    }

    static show() {
        if (!Asistant.getActive()) return;
        Asistant.asistant.style.display = "block";
    }

    static hide() {
        Asistant.asistant.style.display = "none";
    }

    init() {
        const asistente = document.querySelector(".asistente");

        asistente.onmousedown = function (event) {
            let shiftX = event.clientX - asistente.getBoundingClientRect().left;
            let shiftY = event.clientY - asistente.getBoundingClientRect().top;

            asistente.style.position = "absolute";
            asistente.style.zIndex = 1000;
            document.body.append(asistente);

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                asistente.style.left = pageX - shiftX + "px";
                asistente.style.top = pageY - shiftY + "px";
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener("mousemove", onMouseMove);

            asistente.onmouseup = function () {
                document.removeEventListener("mousemove", onMouseMove);
                asistente.onmouseup = null;
            };
        };

        asistente.ondragstart = function () {
            return false;
        };

        let drag = false;
        asistente.addEventListener("mousedown", () => (drag = false));

        asistente.addEventListener("mousemove", () => (drag = true));

        asistente.addEventListener("mouseup", () => {
            // console.log(drag ? 'drag' : 'click')
            if (drag) return;

            this.asistantModal.show();
        });
    }

    static getRect() {
        return this.asistant.getBoundingClientRect();
    }

    static getActive() {
        const item = localStorage.getItem(Asistant.#LOCAL_STORAGE_ASISTANT_KEY);
        // console.log(JSON.parse(item));
        if (item) return JSON.parse(item).isActive;
        else return true;
    }

    static setActive(bool) {
        localStorage.setItem(
            Asistant.#LOCAL_STORAGE_ASISTANT_KEY,
            JSON.stringify({ isActive: bool })
        );
    }
}
