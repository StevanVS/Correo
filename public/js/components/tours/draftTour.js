import Asistant from "../asistant.js";
import Tour from "./tour.js";

export default class DraftTour extends Tour {
    constructor(draftModal) {
        super(draftModal);
        this.intro.setOptions({
            steps: [
                {
                    title: "Como enviar un correo",
                    intro:
                        "Hola de nuevo, esta vez te voy a enseñar como escribir y enviar correos." +
                        Asistant.positionOne,
                },
                {
                    element: "[data-new-draft-btn]",
                    title: "Crear un borrador",
                    intro:
                        "El primer paso es dar click en el botón redactar para empezar a escribir nuestro correo." +
                        Asistant.positionOne,
                },
                {
                    element: "[data-draft-modal]",
                    title: "Ventana de borrador",
                    intro: "Se abrirá esta ventana." + Asistant.positionLeft,
                },
                {
                    element: "[data-draft-to-user-input]",
                    title: "¿Para quién es el correo?",
                    intro:
                        "Indicamos el destinatario de nuestro correo. Para esto, escribimos la dirección de correo electronico de la persona en cuestión." +
                        Asistant.positionTwo,
                },
                {
                    element: "[data-draft-to-user-input]",
                    title: "¿Para quién es el correo?",
                    intro:
                        "Ten en cuenta que puedes enviar el mismo correo a varias personas separando las direcciones de correo con un espacio." +
                        Asistant.positionTwo,
                },
                {
                    element: "[data-draft-subject-input]",
                    title: "El asunto del correo",
                    intro:
                        "Aquí se escribe una pequeña descripción sobre el mensaje del correo." +
                        Asistant.positionTwo,
                },
                {
                    element: "[data-draft-message-input]",
                    title: "El cuerpo del correo",
                    intro:
                        "Es el mensaje en cuestión que se desea transmitar al destinatario." +
                        Asistant.positionTwo,
                },
                {
                    element: "[data-draft-message-input]",
                    title: "El cuerpo del correo",
                    intro:
                        "Recuerda que si escribes una fecha en el mensaje, el destinatario recibirá una notificación para agendar el correo en su calendario." +
                        Asistant.positionTwo,
                },
                {
                    element: "[data-send-email-btn]",
                    title: "Para finalizar",
                    intro:
                        "Una vez escrita toda la información, solo resta pulsar este botón para enviar nuestro correo electrónico." +
                        Asistant.positionTwo,
                },
            ],
        });
    }
}
