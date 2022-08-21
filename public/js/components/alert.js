export default class Alert {
    constructor(text, type) {

        this.values = {
            danger: {
                background: "hsl(0, 67%, 50%)"
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
        }).showToast();
    }
}