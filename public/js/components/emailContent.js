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
        this.deleteEmailBtn = document.querySelector('[data-delete-email-btn]');

        this.email = null;

        this.closeEmailBtn.onclick = () => this.closeEmail();
    }

    setValues(email) {
        this.email = email;

        this.fromUserInfo.textContent = `De: ${email.from_user.name} <${email.from_user.email_address}>`;
        this.toUserInfo.textContent = `Para: ${email.to_user.email_address}`;
        this.subject.textContent = email.subject;
        this.message.textContent = email.message;
        this.date.textContent = formatTimestamp(email.date);
    }

    // PATCH {  values: {labelId, emailId, draftId}, newLabelId: "DELETED" }
    onDelete(callback) {
        this.deleteEmailBtn.onclick = async e => {
            const { label: { id: labelId }, id: emailId } = this.email;
            const values = {
                labelId,
                emailId,
            }
            await callback(values, 'DELETED');
            this.closeEmail();
        }
    }

    openEmail(email) {
        this.setValues(email);
        this.container.style.display = 'block';
    }

    closeEmail() {
        this.container.style.display = 'none';
    }

}