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

        
        this.container.parentElement.ontransitionend = e => {
            if (e.propertyName === "width") {
                this.calendar.updateSize();
            };
        };
    }

    prevDate() {
        this.calendar.prev();
    }

    nextDate() {
        this.calendar.next();
    }

    today() {
        this.calendar.today();
    }

    getTitle() {
        return this.calendar.currentData.viewTitle;
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