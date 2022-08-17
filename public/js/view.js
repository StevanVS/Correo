import Calendar from "./components/calendar.js";
import formatTimestamp from "./components/dateFormater.js";
import DraftModal from "./components/draftModal.js";
import EmailContent from "./components/emailContent.js";
import { menuBtnEvent } from "./main.js";

export default class View {
    constructor() {
        this.model = null;
        this.currentUser = null;
        this.historyId = null;
        this.emails = null;
        this.header = null;

        this.currentLabelId = 'INBOX'

        this.emailsContainer = document.querySelector('[data-emails-rows]');
        this.backgroundTextEl = document.querySelector('[data-background-text-content]');


        this.emailContent = new EmailContent();
        this.draftModal = new DraftModal();

        document.querySelector('[data-inbox-label]').onclick = () => {
            this.currentLabelId = 'INBOX';
            this.render();
        };
        document.querySelector('[data-sents-label]').onclick = () => {
            this.currentLabelId = 'SENT';
            this.render();
        };
        document.querySelector('[data-drafts-label]').onclick = () => {
            this.currentLabelId = 'DRAFT';
            this.render();
        };

        document.querySelector('[data-new-draft-btn]').onclick = async () => this.createDraft();

        this.draftModal.onEdit(async (draftId, values) => this.editDraft(draftId, values));
        this.draftModal.onSubmit(async (draftId, values) => this.sendEmail(draftId, values));


        this.calendar = new Calendar();
        this.calendar.render();

        this.handleWindowResize();
    }

    setModel(model) {
        this.model = model;
    }

    async createDraft() {
        const drafts = await this.model.getUserEmails(['DRAFT']);
        const emptyDraft = drafts.find(draft => (
            !draft.subject && !draft.message && !draft.to_user
        ))

        if (!emptyDraft) {
            this.draftModal.emptyValues();
            this.model.createDraft(this.currentUser.id);
        } else {
            this.draftModal.setValues(emptyDraft);
        }

        this.render();
    }

    async editDraft(draftId, values) {
        await this.model.editDraft(draftId, values)
        if (this.currentLabelId === 'DRAFT') this.render();
    }

    async sendEmail(draftId, { to_user, subject, message }) {
        const toUser = await this.model.getUserByEmail(to_user);
        if (!toUser || toUser == null) {
            alert('No existe usuario con el correo: ' + to_user);
            return false;
        }

        this.model.sendEmail({
            from_user: this.currentUser.id,
            to_user: toUser.id,
            subject: subject,
            message: message,
        })

        this.model.deleteDraft(draftId);

        alert('Correo Enviado!');
        this.render();
        return true;
    }

    async handleRefresh() {
        const newHistoryId = await this.model.getHistoryId();
        if (newHistoryId !== this.historyId) {
            this.historyId = newHistoryId;
            this.render();
        }
    }

    async render() {
        this.currentUser = await this.model.getCurrentUser();
        document.querySelector('[data-username]').innerText = `${this.currentUser.name} ${this.currentUser.lastname}`;

        this.emails = await this.model.getUserEmails([this.currentLabelId]);
        console.log(this.emails);

        document.querySelectorAll('.nav__item').forEach(item => item.classList.remove('selected'))
        document.querySelector(`.nav__item.${this.currentLabelId}`).classList.add('selected');

        this.renderEmails();
    }

    async renderEmails() {
        this.emailsContainer.innerHTML = ''
        this.emails.forEach(email => {
            this.emailsContainer.appendChild(this.createEmailRow(email));
        })
    }

    createEmailRow(email) {
        const row = document.createElement('div');
        row.classList.add('email-row');

        if (email.unread && this.currentLabelId !== 'SENT')
            row.classList.add('unread');

        row.innerHTML = `
            <div class="block"></div>
            <div class="user-icon-field">
                <i class="fa-solid fa-circle-user"></i>
            </div>
            <div class="field-group">
                <div class="user-field">
                    <span class="draft-indicator">[Borrador]</span>
                </div>
                <div class="subject-field"></div>
                <div class="message-field"></div>
            </div>
            <div class="date-field"></div>
        `;

        const fieldGroup = row.children[2];

        // Campo del usuario
        const userField = fieldGroup.children[0];

        if (email.label.id !== 'DRAFT') userField.innerHTML = '';

        const user = this.currentLabelId === 'SENT' || this.currentLabelId === 'DRAFT' ? email.to_user : email.from_user;
        if (user)
            userField.innerHTML += email.label.id !== 'DRAFT' ? `${user.name} ${user.lastname}` : user;
        else
            userField.innerHTML += '(Sin Destinatario)'


        // Campo del asunto
        const subjectField = fieldGroup.children[1];
        subjectField.textContent = !email.subject ? '(Sin Asunto)' : email.subject;

        // Campo del mensaje
        const messageField = fieldGroup.children[2];
        messageField.textContent = !email.message ? '(Sin Mensaje)' : email.message;

        // Campo de la fecha
        const dateField = row.children[3];
        dateField.textContent = formatTimestamp(email.date);

        row.onclick = e => {
            if (email.label.id === 'DRAFT') {
                this.draftModal.openModal(email);
            } else {
                this.emailContent.openEmail(email);
            }
        }

        return row;
    }


    handleWindowResize() {
        let isWitdhShort = false;

        const initialWidth = window.innerWidth;
        if (initialWidth < 992) {
            menuBtnEvent('add');
            isWitdhShort = true;
            this.calendar.changeNumberOfDays(3);
        }

        window.onresize = () => {
            const width = window.innerWidth;
            if (width < 992) {
                if (!isWitdhShort) menuBtnEvent('add');
                isWitdhShort = true;
                this.calendar.changeNumberOfDays(3);
            } else {
                if (isWitdhShort) menuBtnEvent('remove');
                isWitdhShort = false;
                this.calendar.resetNumberOfDays();
            }
        }
    }
}
