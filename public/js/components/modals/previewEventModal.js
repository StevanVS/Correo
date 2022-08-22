import EventDialog from "./eventDialog.js";
import Modal from "./modal.js";

export default class PreviewEventModal extends Modal {
    constructor() {
        super(document.querySelector('[data-preview-event-modal]'),
            [document.querySelector('[data-close-preview-event-modal-btn]')]);

        this.event = null;

        this.editEventModal = new EventDialog();

        this.titleField = document.querySelector('[data-event-title-field]');
        this.startField = document.querySelector('[data-event-start-field]');
        this.endField = document.querySelector('[data-event-end-field]');
        this.descriptionField = document.querySelector('[data-event-description-field]');

        this.editEventBtn = document.querySelector('[data-edit-event-btn]');
        this.deleteEventBtn = document.querySelector('[data-delete-event-btn]');

        this.editEventCallback = null;

        this.eventBoundingRect = null;

        this.#setEventListeners();
    }

    onEditEvent(callback) {
        this.editEventCallback = callback;
    }

    onDeleteEvent(callback) {
        this.deleteEventBtn.onclick = e => {
            callback(this.event.id);
            this.close();
        }
    }

    showModal(elBoundingRect) {
        this.eventBoundingRect = elBoundingRect;

        super.show();

        const { left: eLeft, right: eRight, top: eTop, width: eWidth } = elBoundingRect;

        const { height: mHeight, width: mWidth } = this.modal.getBoundingClientRect();

        if (eRight > window.innerWidth - 50) this.modal.style.right = 0;
        else if (eLeft < 50) this.modal.style.left = 0;
        else this.modal.style.left = (eLeft - (mWidth - eWidth) / 2) + 'px';

        this.modal.style.top = (eTop - mHeight - 5) + 'px';
    }

    close() {
        super.close();
        this.modal.style.top =
            (this.eventBoundingRect.top + this.eventBoundingRect.height) + 'px';
    }

    setValues(event) {
        this.event = event;

        const { title, start, end, extendedProps: { description } } = event;

        this.titleField.textContent = title;
        this.startField.textContent = start.toLocaleString('es');

        if (!end) this.endField.parentElement.style.display = 'none';
        else this.endField.parentElement.style.display = '';

        this.endField.textContent = end ? end.toLocaleString('es') : '';

        if (!description) this.descriptionField.parentElement.style.display = 'none';
        else this.descriptionField.parentElement.style.display = '';

        this.descriptionField.textContent = description || '';
    }

    handleModalClose(e) {
        if (!this.modal.contains(e.target) && this.modal.hasAttribute('open')) this.close()
    }

    #setEventListeners() {
        this.editEventBtn.onclick = e => {
            this.editEventModal.setTitle('Editar Evento');
            this.editEventModal.setValues(this.event);
            this.editEventModal.onSubmit(this.editEventCallback);
            this.editEventModal.showModal();
            this.close()
        }

    }
}