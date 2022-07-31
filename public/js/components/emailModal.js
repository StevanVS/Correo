export default class EmailModal {
    constructor() {
        this.form = document.querySelector('[data-email-form]');
        this.toUser = document.querySelector('[data-to-user-input]');
        this.subject = document.querySelector('[data-subject-input]');
        this.message = document.querySelector('[data-message-input]');
        this.btn = document.querySelector('[data-send-email-btn]');
    }
}
