export default class EventDialog {
    constructor() {
        this.dialog = document.querySelector('[data-event-dialog]');

        this.dialog.onmousedown = e => {
            if (e.target.tagName === 'DIALOG')
                this.close();
        }

        document.querySelector('[data-close-event-dialog-btn]').onclick = e => {
            this.close();
        }
    }

    show() {
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
    }
}