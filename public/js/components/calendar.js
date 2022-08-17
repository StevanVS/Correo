import Tooltip from "./tooltip.js";

export default class Calendar {
    constructor(events) {
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
            eventDidMount(info) {
                if (info.event.extendedProps.description)
                    new Tooltip(info.el, info.event.extendedProps.description);
            },
            editable: true,
        });

        this.setEvents();
        this.refreshTitle();
        this.render();
    }

    onEventChange(callback) {
        this.calendar.setOption('eventChange', (changeInfo) => {
            const e = changeInfo.event;
            const values = {
                title: e.title,
                start: e.start,
                end: e.end,
                description: e.extendedProps.description,
            }

            callback(e.id, values);
        })
    }

    createEvent(title, description, start, end) {
        this.calendar.addEvent({
            id: `event-${Date.now()}`,
            title: title,
            start: start,
            end: end,
            extendedProps: {
                description: description,
            }
        });
    }

    refreshTitle() {
        document.querySelector('[data-calendar-title]').textContent = this.calendar.currentData.viewTitle;
    }

    changeNumberOfDays(number) {
        this.calendar.changeView('dayGrid')
        this.setProperty('duration', { days: number })
    }

    resetNumberOfDays() {
        this.calendar.changeView('dayGridWeek')
        this.setProperty('duration', null)
    }

    setProperty(name, value) {
        this.calendar.setOption(name, value);
    }

    getProperty(name) {
        return this.calendar.getOption(name);
    }

    setEvents() {
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
                this.createEvent('hola', null, Date.now(), null)
            }
        })
    }

    render() {
        this.calendar.render();
    }
}