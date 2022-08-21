export default class EmailAlert {
    constructor() {
        this.isHidden = true;
        this.alert = document.querySelector('[data-email-alert-container]');
        this.text = document.querySelector('[data-email-alert-text]');
        

        this.alert.ontransitionend = () => {
            if (this.isHidden) {
                this.alert.style.visibility = 'visible'
            }
            if (!this.isHidden) {
                this.alert.style.zIndex = 0;
            }
        }
    }

    show(text) {
        this.alert.style.visibility = 'visible'
        this.text.textContent = text;
        this.isHidden = false;
        this.alert.classList.add('show');
    }

    hide() {
        this.alert.style.zIndex = -1;
        this.alert.style.visibility = 'hidden'
        this.alert.classList.remove('show');
        this.isHidden = true;
    }
}