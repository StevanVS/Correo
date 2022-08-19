import Modal from "./Modal.js";

export default class EventDialog extends Modal {
    constructor() {
        super(document.querySelector('[data-event-dialog]'));

        this.event = null;

        this.eventForm = document.querySelector('[data-event-form]');
        this.titleInput = document.querySelector('[data-event-title-input]');
        this.startInput = document.querySelector('[data-event-start-input]');
        this.endInput = document.querySelector('[data-event-end-input]');
        this.descriptionInput = document.querySelector('[data-event-description-input]');

        this.#setEventListeners();
    }

    onSubmit(callback) {
        this.eventForm.onsubmit = e => {
            const values = {
                id: !this.event ? `event-${Date.now()}` : this.event.id,
                title: this.titleInput.value,
                start: this.startInput.value,
                end: this.endInput.value || null,
                description: this.descriptionInput.value || null,
            }
            callback(values);
            this.emptyValues();
        }
    }

    show() {
        super.show();
        this.modal.style.margin = 'auto';
    }
    close() {
        this.modal.style.margin = 0;
        super.close();
    }

    emptyValues() {
        this.event = null;
        this.titleInput.value = '';
        this.startInput.value = '';
        this.endInput.value = '';
        this.descriptionInput.value = '';
    }

    setValues(event) {
        this.event = event;
        const { title, start, end, extendedProps: { description } } = event;
        this.titleInput.value = title;
        this.startInput.value = this.#formatDate(start);
        this.endInput.value = end ? this.#formatDate(end) : '';
        this.descriptionInput.value = description || '';
    }

    setTitle(title) {
        document.querySelector('[data-event-dialog-title]').textContent = title;
    }

    #formatDate(d) {

        let month = d.getMonth();
        month++;
        month = this.#toTwoDigits(month);

        const day = this.#toTwoDigits(d.getDate())

        let year = d.getFullYear();

        const hours = this.#toTwoDigits(d.getHours())

        const min = this.#toTwoDigits(d.getMinutes());

        const dateString = `${year}-${month}-${day}T${hours}:${min}`;
        console.log(dateString);
        return dateString;
    }

    #toTwoDigits(v) {
        return v.toString().length === 1 ? `0${v}` : v;
    }

    #setEventListeners() {
        document.querySelector('[data-close-event-dialog-btn]').onclick = e => {
            this.close();
        }
    }
}