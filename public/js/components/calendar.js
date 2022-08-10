export default class Calendar {
    constructor(events) {
        this.calendarEl = document.getElementById('calendar');
        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: 'dayGridWeek',
            locale: 'es',
            height: '200px',
        });
    }

    setProperty(name, value) {
        this.calendar.setOption(name, value);
    }

    getProperty(name) {
        return this.calendar.getOption(name);
    }

    updateSizeOnTransitionEnd(element) {
        element.ontransitionend = e => {
            if (e.target === element) {
                this.calendar.updateSize();
            };
        };
    }

    render() {
        this.calendar.render();
    }
}