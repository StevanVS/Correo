import { formatDate } from "../utils/dateFormater.js";
import EventDialog from "./modals/eventDialog.js";
import PreviewEventModal from "./modals/previewEventModal.js";
import breakPoints from "../utils/breakPoints.js";
export default class Calendar {
    constructor() {
        this.eventDialog = new EventDialog();
        this.previewEventModal = new PreviewEventModal();

        this.container = document.querySelector(".calendar-container");
        this.calendarEl = document.getElementById("calendar");

        this.calendar = new FullCalendar.Calendar(this.calendarEl, {
            initialView: "dayGridWeek",
            // duration: null,
            locale: "es",
            height: "30vh",
            headerToolbar: false,
            events: { url: "/api/users/me/events" },
            eventTimeFormat: {
                hour: "2-digit",
                minute: "2-digit",
            },
            editable: true,
            displayEventEnd: true,
        });

        this.updateSize();

        this.createEventCallback = null;

        this.#setEventListeners();
        this.refreshTitle();
        this.render();
    }

    onEventChange(callback) {
        this.calendar.setOption("eventChange", async (changeInfo) => {
            const e = changeInfo.event;
            const values = {
                title: e.title,
                start: formatDate(e.start),
                end: e.end ? formatDate(e.end) : null,
                description: e.extendedProps.description,
            };
            callback(e.id, values);
        });
    }

    onCreateEvent(callback) {
        this.createEventCallback = callback;
    }

    onEditEvent(callback) {
        this.previewEventModal.onEditEvent(callback);
    }

    onDeleteEvent(callback) {
        this.previewEventModal.onDeleteEvent(callback);
    }

    refreshTitle() {
        document.querySelector("[data-calendar-title]").textContent =
            this.calendar.currentData.viewTitle;
    }

    changeNumberOfDays(number) {
        this.calendar.changeView("dayGrid");
        this.setProperty("duration", { days: number });
        this.refreshTitle();
    }

    resetNumberOfDays() {
        this.calendar.changeView("dayGridWeek");
        this.setProperty("duration", null);
        this.refreshTitle();
    }

    setProperty(name, value) {
        this.calendar.setOption(name, value);
    }

    getProperty(name) {
        return this.calendar.getOption(name);
    }

    createEvent() {
        this.eventDialog.emptyValues();
        this.eventDialog.setTitle("Evento Nuevo");
        this.eventDialog.onSubmit(this.createEventCallback);
        this.eventDialog.showModal();
    }

    updateSize() {
        const width = window.innerWidth;
        if (width > breakPoints.large) {
            this.resetNumberOfDays();
        } else if (width > breakPoints.medium) {
            this.changeNumberOfDays(4);
        } else {
            this.changeNumberOfDays(3);
        }
    }

    #setEventListeners() {
        this.container.parentElement.ontransitionend = (e) => {
            if (e.propertyName === "width") {
                this.calendar.updateSize();
            }
        };

        document.querySelectorAll("[data-calendar-handle]").forEach((btn) => {
            btn.onclick = (e) => {
                this.container.classList.toggle("close");
                this.calendar.updateSize();
            };
        });

        document.querySelector("[data-calendar-today-btn]").onclick = (e) => {
            this.calendar.today();
            this.refreshTitle();
        };

        document.querySelector("[data-calendar-prev-btn]").onclick = (e) => {
            this.calendar.prev();
            this.refreshTitle();
        };

        document.querySelector("[data-calendar-next-btn]").onclick = (e) => {
            this.calendar.next();
            this.refreshTitle();
        };

        this.container.querySelector("[data-new-calendar-event-btn]").onclick =
            (e) => {
                this.createEvent();
            };

        this.calendar.setOption("eventClick", (eventClickInfo) => {
            this.previewEventModal.setValues(eventClickInfo.event);
            this.previewEventModal.showModal(
                eventClickInfo.el.getBoundingClientRect()
            );
        });
    }

    render() {
        this.calendar.render();
    }

    refresh() {
        this.calendar.refetchEvents();
    }
    close() {
        this.container.classList.add("close");
    }
    open() {
        this.container.classList.remove("close");
    }
}
