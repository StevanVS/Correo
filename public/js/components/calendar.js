export default class Calendar {
    constructor(events) {
        this.container = document.querySelector('.calendar-container');
        this.calendarEl = document.getElementById('calendar');
        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridWeek',
            locale: 'es',
            height: '200px',
        });

        
        this.container.parentElement.ontransitionend = e => {
            if (e.propertyName === "width") {
                this.calendar.updateSize();
            };
        };
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