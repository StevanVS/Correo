import Asistant from "../asistant.js";
import Tour from "./tour.js";


export default class EventTour extends Tour {
    constructor(eventModal) {
        super(eventModal);
        this.intro.setOptions({
            steps: [
                {
                    title: "Como agendar un evento",
                    intro:
                        "Hola, en esta ocasión te voy a enseñar como agendar una fecha en el calendario. Estas agendaciones las llamaremos eventos." +
                        Asistant.positionOne,
                },
                {
                    element:'.calendar-container [data-new-calendar-event-btn]',
                    title: "Crear un evento",
                    position: 'top',
                    intro:
                        "Pedemos crear un evento dando click en este botón dentro del calendario." +
                        Asistant.positionLeft,
                },
                {
                    element: '[data-event-dialog]',
                    title: "Ventana de evento",
                    intro:
                        "Se abrirá esta ventana donde crearemos el evento." +
                        Asistant.positionTwo,
                },
                {
                    element: '[data-event-title-input]',
                    title: "Nombre del evento",
                    intro:
                        "Aquí le damos un nombre descriptivo al evento." +
                        Asistant.positionTwo,
                },
                {
                    element: '[data-event-start-input]',
                    title: "Fecha de inicio",
                    intro:
                        "En este apartado asignaremos una fecha para el evento." +
                        Asistant.positionTwo,
                },
                {
                    element: '[data-event-end-input]',
                    title: "Fecha de finalización",
                    intro:
                        "En caso de que el evento tenga una duración establecida, completamos este campo con la fecha de fin. Caso contrario, se deja vacío." +
                        Asistant.positionTwo,
                },
                {
                    element: '[data-event-description-input]',
                    title: "Descripción del evento",
                    intro:
                        "Aquí escribiremos los detalles que involucran al evento, por ejemplo, el lugar de realización, datos importantes, etc." +
                        Asistant.positionTwo,
                },
                {
                    element: '[data-save-event-btn]',
                    title: "Guardar el evento",
                    intro:
                        "Guardamos el evento dando click en el botón Guardar." +
                        Asistant.positionOne,
                },
                {
                    element: '#calendar',
                    title: "Para finalizar",
                    intro:
                        "Podremos visualizar todos los eventos creados en el calendario." +
                        Asistant.positionTwo,
                },
            ],
        });
    }
}
