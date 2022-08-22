import Modal from "./modal.js";

export default class DraftModal extends Modal {
    constructor() {
        super(document.querySelector("[data-draft-modal]"),
            [document.querySelector('[data-close-draft-modal-btn]')]);

        this.form = document.querySelector('[data-draft-form]');
        this.toUserInput = document.querySelector('[data-draft-to-user-input]');
        this.subjectInput = document.querySelector('[data-draft-subject-input]');
        this.messageInput = document.querySelector('[data-draft-message-input]');

        this.draftId = null
        this.draft = null;
    }

    setDraftId(id) {
        this.draftId = id;
    }

    setValues(draft) {
        this.draft = draft;
        this.draftId = draft.id;
        this.toUserInput.value = draft.to_user;
        this.subjectInput.value = draft.subject;
        this.messageInput.value = draft.message;
    }

    emptyValues() {
        this.toUserInput.value = null;
        this.subjectInput.value = null;
        this.messageInput.value = null;
    }

    onEdit(callback) {
        const inputs = [this.toUserInput, this.subjectInput, this.messageInput];
        inputs.forEach(intputEl => {
            intputEl.onblur = (e) => callback(this.draftId, {
                to_user: this.toUserInput.value,
                subject: this.subjectInput.value,
                message: this.messageInput.value,
            })
        })
    }

    onSubmit(callback) {
        this.form.onsubmit = (e) => {
            e.preventDefault();

            callback(this.draftId, {
                to_user: this.toUserInput.value, // String
                subject: this.subjectInput.value,
                message: this.messageInput.value,
            }).then(emailSent => {
                if (emailSent) {
                    this.close();
                    this.emptyValues();
                }
            });
        }
    }

    showModal() {
        super.showModal();
        this.modal.style.margin = 'auto';
    }
    close() {
        this.modal.style.margin = 0;
        super.close();
    }

}
