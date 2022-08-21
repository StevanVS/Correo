import Modal from "./Modal.js";
import { formatDate } from "../utils/dateFormater.js";

export default class EventDialog extends Modal {
    constructor() {
        super(document.querySelector('[data-event-dialog]'),
            document.querySelector('[data-close-event-dialog-btn]'));

        this.event = null;

        this.eventForm = document.querySelector('[data-event-form]');
        this.titleInput = document.querySelector('[data-event-title-input]');
        this.startInput = document.querySelector('[data-event-start-input]');
        this.endInput = document.querySelector('[data-event-end-input]');
        this.descriptionInput = document.querySelector('[data-event-description-input]');
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

    showModal() {
        super.showModal();
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
        this.startInput.value = formatDate(start);
        this.endInput.value = end ? formatDate(end) : '';
        this.descriptionInput.value = description || '';
    }

    setTitle(title) {
        document.querySelector('[data-event-dialog-title]').textContent = title;
    }
}