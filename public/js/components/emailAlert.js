export default class EmailAlert {
    constructor() {
        this.alert = document.querySelector('[data-email-alert-container]');
        this.text = document.querySelector('[data-email-alert-content]');
    }

    show(text) {
        this.text.textContent = text;
        this.alert.classList.add('show');
    }

    hide() {
        this.alert.classList.remove('show');
    }
}