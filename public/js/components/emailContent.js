import { formatTimestamp } from "../utils/dateFormater.js";
import ConfirmModal from "./confirmModal.js";
import Alert from './alert.js';

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
        this.replyEmailBtn = document.querySelector('[data-reply-email-btn]');

        this.changeLabelBtns = document.querySelectorAll('[for-label]');

        this.email = null;

        this.closeEmailBtn.onclick = () => this.closeEmail();
    }

    setValues(email) {
        this.email = email;

        this.fromUserInfo.textContent = `De: ${email.from_user.name} <${email.from_user.email_address}>`;
        this.toUserInfo.textContent = `Para: ${email.to_user.email_address}`;
        this.subject.textContent = !email.subject ? '(Sin Asunto)' : email.subject;
        this.message.textContent = !email.message ? '(Sin Mensaje)' : email.message;
        this.date.textContent = formatTimestamp(email.date);

        this.#manageBtns();
    }

    /*
            this.draft = draft;
            this.draftId = draft.id;
            this.toUserInput.value = draft.to_user;
            this.subjectInput.value = draft.subject;
            this.messageInput.value = draft.message;
    */
    onReply(callback) {
        this.replyEmailBtn.onclick = () => {
            const draft = {
                to_user: this.email.from_user.email_address,
                subject: `RE: ${this.email.subject}`,
                message: '',
            }
            callback(draft);
        }
    }

    onDelete(callback) {
        this.deleteEmailBtn.onclick = e => {
            new ConfirmModal('Está seguro que desea Eliminar este Correo Permanentemente?', () => {
                callback(this.email.id);
                this.closeEmail();
                new Alert('Correo Eliminado Permanentemente', 'error')
            });
        }
    }

    // PATCH {  values: {labelId, emailId, draftId}, newLabelId: "DELETED" }
    onChangeLabel(callback, promiseLabels) {
        this.changeLabelBtns.forEach(btn => {
            btn.onclick = async () => {
                const { label: { id: labelId }, id: emailId } = this.email;
                const values = {
                    labelId,
                    emailId,
                };
                const newLabelId = btn.getAttribute('for-label');

                const labels = await promiseLabels;
                const newLabelName = labels.find(label => label.id === newLabelId).name;

                new ConfirmModal(`El Correo se moverá a ${newLabelName}, está seguro?`,
                    () => {
                        callback(values, newLabelId);
                        this.closeEmail();
                        new Alert(`Correo enviado a ${newLabelName}`, 'info');
                    }
                );
            }
        })
    }

    openEmail(email) {
        this.setValues(email);
        this.container.classList.add('open');
    }

    closeEmail() {
        this.container.classList.remove('open');
    }

    #manageBtns() {
        if (this.email.label.id !== 'DELETED') {
            document.querySelector('[data-trash-email-btn]').style.display = 'block';
            document.querySelector('[data-untrash-email-btn]').style.display = 'none';
            this.deleteEmailBtn.style.display = 'none';
        } else {
            document.querySelector('[data-trash-email-btn]').style.display = 'none';
            document.querySelector('[data-untrash-email-btn]').style.display = 'block';
            this.deleteEmailBtn.style.display = 'block';
        }
    }
}