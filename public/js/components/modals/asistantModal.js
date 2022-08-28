import Asistant from "../asistant.js";
import Modal from "./modal.js";

export default class AsistantModal extends Modal {
    constructor() {
        super(
            document.querySelector('[data-asistant-modal]'),
            [document.querySelector('[data-close-asistant-modal-btn]')]
        );

        this.title = document.querySelector('[data-asistant-modal-title]')
        this.mainList = document.querySelector('[data-main-asistant-list]')
        this.shortcutsList = document.querySelector('[data-shortcuts-list]')

        this.shortcutsBtn = document.querySelector('[data-shortcuts-help-btn]');
        this.shortcutsBtn.onclick = () => {
            this.title.textContent = 'Atajos de teclado';
            this.mainList.style.display = 'none';
            this.shortcutsList.style.display = 'block';
        }
    }

    show() {
        this.title.textContent = '¿En qué puedo ayudarte?';
        this.mainList.style.display = 'block';
        this.shortcutsList.style.display = 'none';

        super.showModal();
        this.modal.style.margin = 0;

        // console.log(Asistant.getRect());
        const {
            left: aLeft, right: aRight,
            top: aTop, bottom: aBottom,
            width: aWidth, height: aHeight,
        } = Asistant.getRect();

        const {
            width: mWidth, height: mHeight,
        } = this.modal.getBoundingClientRect();


        if (aLeft + (aWidth / 2) > window.innerWidth / 2) {
            this.modal.style.left = (aLeft - 20 - mWidth) + 'px';
            this.modal.classList.add('left')
        } else {
            this.modal.style.left = aRight + 20 + 'px';
            this.modal.classList.remove('left')
        }

        if (this.modal.style.left < '0px') {
            this.modal.style.width = aLeft - 20 + 'px'
            this.modal.style.left = 0;
        }


        this.modal.style.top = aTop + (aHeight / 2) - mHeight + 'px';
        if (this.modal.style.top < '0px') {
            this.modal.style.top = 0
        }
        if (
            parseInt(
                this.modal.style.top.slice(0, -2)
            ) + mHeight > window.innerHeight
        ) {
            this.modal.style.top = window.innerHeight - mHeight + 'px';
        }

        // console.log(this.modal.getBoundingClientRect());
    }
}