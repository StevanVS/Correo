import { formatDate } from "./dateFormater.js";
import EventDialog from "./eventDialog.js";
import PreviewEventModal from "./previewEventModal.js";

export default class Calendar {
    constructor() {
        this.eventDialog = new EventDialog('Evento Nuevo');
        this.previewEventModal = new PreviewEventModal();

        this.container = document.querySelector('.calendar-container');
        this.calendarEl = document.getElementById('calendar');

        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridWeek',
            duration: null,
            locale: 'es',
            height: '180px',
            headerToolbar: false,
            events: { url: '/api/users/me/events' },
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
            },
            editable: true,
            displayEventEnd: true,
        });

        this.createEventCallback = null;

        this.#setEventListeners();
        this.refreshTitle();
        this.render();
    }

    onEventChange(callback) {
        this.calendar.setOption('eventChange', (changeInfo) => {
            const e = changeInfo.event;
            const values = {
                title: e.title,
                start: formatDate(e.start),
                end: e.end ? formatDate(e.end) : null,
                description: e.extendedProps.description,
            }

            callback(e.id, values);
        })
    }

    onCreateEvent(callback) {
        // this.eventDialog.onSubmit(callback);
        this.createEventCallback = callback;
    }

    onEditEvent(callback) {
        this.previewEventModal.onEditEvent(callback);
    }

    onDeleteEvent(callback) {
        this.previewEventModal.onDeleteEvent(callback);
    }

    refreshTitle() {
        document.querySelector('[data-calendar-title]').textContent = this.calendar.currentData.viewTitle;
    }

    changeNumberOfDays(number) {
        this.calendar.changeView('dayGrid');
        this.setProperty('duration', { days: number });
        this.refreshTitle();
    }

    resetNumberOfDays() {
        this.calendar.changeView('dayGridWeek')
        this.setProperty('duration', null)
        this.refreshTitle();
    }

    setProperty(name, value) {
        this.calendar.setOption(name, value);
    }

    getProperty(name) {
        return this.calendar.getOption(name);
    }

    #setEventListeners() {
        this.container.parentElement.ontransitionend = e => {
            if (e.propertyName === "width") {
                this.calendar.updateSize();
            };
        };

        document.querySelector('[data-calendar-handle]').onclick = e => {
            this.container.classList.toggle('close');
        };

        document.querySelector('[data-calendar-today-btn]').onclick = e => {
            this.calendar.today();
            this.refreshTitle();
        };

        document.querySelector('[data-calendar-prev-btn]').onclick = e => {
            this.calendar.prev();
            this.refreshTitle();
        };

        document.querySelector('[data-calendar-next-btn]').onclick = e => {
            this.calendar.next();
            this.refreshTitle();
        };

        document.querySelectorAll('[data-new-calendar-event-btn]').forEach(btn => {
            btn.onclick = e => {
                this.eventDialog.emptyValues();
                this.eventDialog.setTitle('Evento Nuevo');
                this.eventDialog.onSubmit(this.createEventCallback);
                this.eventDialog.show();
            }
        });

        this.calendar.setOption('eventClick', (eventClickInfo) => {
            this.previewEventModal.setValues(eventClickInfo.event)
            this.previewEventModal.show(eventClickInfo.el.getBoundingClientRect());
        });
    }

    render() {
        this.calendar.render();
    }

    refresh() {
        this.calendar.refetchEvents();
    }
}