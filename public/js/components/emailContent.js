import formatTimestamp from "./dateFormater.js";

export default class EmailContent {
    constructor() {
        this.container = document.querySelector('[data-email-content]');
        this.subject = document.querySelector('[data-email-subject]');
        this.fromUserInfo = document.querySelector('[data-email-from-user-info]');
        this.date = document.querySelector('[data-email-date]');
        this.toUserInfo = document.querySelector('[data-email-to-user-info]');
        this.message = document.querySelector('[data-email-message]');

        this.closeEmailBtn = document.querySelector('[data-close-email-btn]');

        this.email = null;

        this.closeEmailBtn.onclick = () => this.closeEmail();
    }

    setValues(emailObj, fromUserObj, toUserObj) {
        this.subject.innerText = emailObj.subject;
        this.fromUserInfo.innerText = `De: ${fromUserObj.name} <${fromUserObj.email_address}>`;
        this.date.innerText = formatTimestamp(emailObj.date);
        this.toUserInfo.innerText = `Para: ${toUserObj.email_address}`;
        this.message.innerText = emailObj.message;
    }

    openEmail() {
        this.container.style.display = 'block';
    }
    
    closeEmail() {
        this.container.style.display = 'none';
    }

}