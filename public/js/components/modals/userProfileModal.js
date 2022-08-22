import Modal from "./Modal.js";

export default class UserProfileModal extends Modal {
    constructor() {
        super(document.querySelector('[data-user-profile-modal]'),
            [document.querySelector('[data-close-user-profile-modal-btn]')]);

        
    }

    onSubmit(callback) {
        this.modal.onsubmit = e => {
            e.preventDefault();
            callback(); //todo pasar nuevos datos de usuario
        }
    }
}