import Modal from "./modal.js";
import { formatDate } from "../../utils/dateFormater.js";

export default class EventDialog extends Modal {
    constructor() {
        super(document.querySelector('[data-event-dialog]'),
            [document.querySelector('[data-close-event-dialog-btn]')]);

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
                id: !this.event || !this.event.id ? `event-${Date.now()}` : this.event.id,
                title: this.titleInput.value,
                start: this.startInput.value,
                end: this.endInput.value || null,
                all_day: new Date(this.startInput.value).getHours() === 0 ? true : false,
                description: this.descriptionInput.value || null,
            }
            
            callback(values);
            this.emptyValues();
        }
    }

    showModal() {
        super.showModal();
    }

    close() {
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
        const { title, start, end, extendedProps } = event;
        this.titleInput.value = title;
        this.startInput.value = start ? formatDate(start) : '';
        this.endInput.value = end ? formatDate(end) : '';

        if (!extendedProps) return;
        const { description } = extendedProps;
        this.descriptionInput.value = description || '';
    }

    setTitle(title) {
        document.querySelector('[data-event-dialog-title]').textContent = title;
    }
}