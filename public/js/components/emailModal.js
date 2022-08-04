export default class EmailModal {
    constructor() {
        this.modal = document.querySelector("[data-email-modal]");
        this.form = document.querySelector('[data-email-form]');
        this.toUser = document.querySelector('[data-to-user-input]');
        this.subject = document.querySelector('[data-subject-input]');
        this.message = document.querySelector('[data-message-input]');

        // this.sendEmailBtn = document.querySelector('[data-send-email-btn]');

        this.draft = null;
    }

    setValues(draft) {
        this.draft = draft;
        this.toUser.value = draft.to_user;
        this.subject.value = draft.subject;
        this.message.value = draft.message;
    }

    onKeyUp(callback) {
        const inputs = [this.toUser, this.subject, this.message];
        inputs.forEach(intputEl => {
            intputEl.onkeyup = (e) => callback(this.draft.id, {
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
                    this.modal.classList.toggle('active');
                    this.emptyValues();
                }
            });
        }
    }

    emptyValues() {
        this.toUser.value = null;
        this.subject.value = null;
        this.message.value = null;
    }
}
