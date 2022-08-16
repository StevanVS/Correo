export default class DraftModal {
    constructor() {
        this.modal = document.querySelector("[data-draft-modal]");
        this.form = document.querySelector('[data-draft-form]');
        this.toUser = document.querySelector('[data-draft-to-user-input]');
        this.subject = document.querySelector('[data-draft-subject-input]');
        this.message = document.querySelector('[data-draft-message-input]');

        this.draft = null;
    }

    setValues(draft) {
        this.draft = draft;
        this.toUser.value = draft.to_user;
        this.subject.value = draft.subject;
        this.message.value = draft.message;
    }

    emptyValues() {
        this.toUser.value = null;
        this.subject.value = null;
        this.message.value = null;
    }

    onEdit(callback) {
        const inputs = [this.toUser, this.subject, this.message];
        inputs.forEach(intputEl => {
            intputEl.onblur = (e) => callback(this.draft.id, {
                to_user: this.toUser.value,
                subject: this.subject.value,
                message: this.message.value,
            })
        })
    }

    onSubmit(callback) {
        this.form.onsubmit = (e) => {
            e.preventDefault();

            callback(this.draft.id, {
                to_user: this.toUser.value, // String
                subject: this.subject.value,
                message: this.message.value,
            }).then(emailSent => {
                if (emailSent) {
                    this.closeModal();
                    this.emptyValues();
                }
            });
        }
    }

    openModal(draft) {
        this.setValues(draft);
        this.modal.classList.add("active");
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

}
