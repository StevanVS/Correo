import Asistant from "../asistant.js";
import Modal from "./modal.js";

export default class ConfirmModal extends Modal {
    constructor(text, callback) {
        super(document.querySelector('[data-confirm-modal]'),
            [document.querySelector('[data-close-confirm-modal-btn]'),
            document.querySelector('[data-cancel-btn]')]);


        this.modal.querySelector('[data-dialog-text]').textContent = text;

        this.confirmBtn = this.modal.querySelector('[data-confirm-btn]');
        this.confirmBtn.onclick = () => {
            callback();
            this.close();
        }

        this.modal.appendChild(Asistant.asistantEl())

        this.showModal();
    }

    showModal() {
        super.showModal();
        this.modal.style.margin = '25vh auto';
        Asistant.hide()
    }

    close() {
        this.modal.style.margin = 0;
        super.close();
        Asistant.show();
    }
}