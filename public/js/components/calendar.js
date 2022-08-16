export default class Calendar {
    constructor(events) {
        this.container = document.querySelector('.calendar-container');
        this.calendarEl = document.getElementById('calendar');

        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridWeek',
            locale: 'es',
            height: '180px',
            headerToolbar: false,
        });

        this.container.parentElement.addEventListener('transitionend', (e) => {
            this.calendar.updateSize();
        }, { once: true })


        document.querySelector('[data-calendar-handle]').onclick = e => {
            this.container.classList.toggle('close');
        }

        this.refreshTitle();

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

    }

    refreshTitle() {
        document.querySelector('[data-calendar-title]').textContent = this.calendar.currentData.viewTitle;
    }

    setProperty(name, value) {
        this.calendar.setOption(name, value);
    }

    getProperty(name) {
        return this.calendar.getOption(name);
    }

    render() {
        this.calendar.render();
    }
}