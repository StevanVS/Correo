import Modal from "./Modal.js";

export default class UserProfileModal extends Modal {
    constructor() {
        super(document.querySelector('[data-user-profile-modal]'),
            [document.querySelector('[data-close-user-profile-modal-btn]')]);

        this.form = this.modal.querySelector('[data-modal-form]')
        this.file = this.modal.querySelector('#file')
    }

    onSubmit(callback) {
        this.form.onsubmit = e => {
            e.preventDefault();
            // const data = new FormData(this.form)
            // console.log([...data.entries()]);
            // callback(); //todo pasar nuevos datos de usuario

            console.log(this.form.result);

        }
    }
}