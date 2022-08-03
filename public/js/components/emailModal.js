export default class EmailModal {
    constructor() {
        this.form = document.querySelector('[data-email-form]');
        this.toUser = document.querySelector('[data-to-user-input]');
        this.subject = document.querySelector('[data-subject-input]');
        this.message = document.querySelector('[data-message-input]');
        // this.btn = document.querySelector('[data-send-email-btn]');
        this.draft = null;
    }

    setValues(draft) {
        this.draft = draft;
        this.toUser.value = draft.toUser;
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

    }
}
