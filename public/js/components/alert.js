export default class Alert {
    constructor(text, type, element) {
        this.values = {
            error: {
                background: "hsl(0, 67%, 50%)"
            },
            success: {
                background: '#4900c2'
            },
            info: {
                background: '#0074c7'
            }
        }

        Toastify({
            text: text,
            duration: 5000,
            close: true,
            position: "center",
            style: {
                background: type ? this.values[type].background : 'blue',
            },
            offset: {
                y: '-0.4rem'
            },
            selector: element,
        }).showToast();
    }
}