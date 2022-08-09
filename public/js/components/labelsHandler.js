export default class LabelsHandler {
    static labels = {
        inbox: {
            name: 'INBOX',
            headers: ['De', 'Asunto', 'Mensaje', 'Recibido'],
            fn: null,
        },
        sent: {
            name: 'SENT',
            headers: ['Para', 'Asunto', 'Mensaje', 'Enviado'],
            fn: null,
        },
        draft: {
            name: 'DRAFT',
            headers: ['Para', 'Asunto', 'Mensaje', 'Enviado'],
            fn: null,
        },
    }

    // [
    //     [labels.inbox, getEmailsTo],
    //     [labels.sent, getEmailsFrom],
    // ]
    static asignFunctions(values) {
        for (const entrie of values) {
            entrie[0].fn = entrie[1];
        }
    }
}