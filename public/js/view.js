import Calendar from "./components/calendar.js";
import formatTimestamp from "./components/dateFormater.js";
import DraftModal from "./components/draftModal.js";
import EmailContent from "./components/emailContent.js";
import LabelsHandler from "./components/labelsHandler.js";
import { menuBtnEvent } from "./main.js";

export default class View {
    constructor() {
        this.model = null;
        this.currentUser = null;
        this.emails = null;
        this.header = null;


        this.labels = LabelsHandler.labels;

        this.currentLabel = this.labels.inbox.name;
        this.emailsContainer = document.querySelector('[data-emails-rows]');
        this.backgroundTextEl = document.querySelector('[data-background-text-content]');


        this.emailContent = new EmailContent();
        this.draftModal = new DraftModal();

        document.querySelector('[data-inbox-label]').onclick = () => {
            this.currentLabel = this.labels.inbox.name;
            this.render();
        };
        document.querySelector('[data-sents-label]').onclick = () => {
            this.currentLabel = this.labels.sent.name;
            this.render();
        };
        document.querySelector('[data-drafts-label]').onclick = () => {
            this.currentLabel = this.labels.draft.name;
            this.render();
        };

        document.querySelector('[data-new-draft-btn]').onclick = async () => this.createDraft();

        this.draftModal.onKeyUp(async (draftId, values) => this.editDraft(draftId, values));
        this.draftModal.onSubmit(async (draftId, values) => this.sendEmail(draftId, values));

        this.handleWindowResize();

        this.calendar = new Calendar();
        this.calendar.render();
        this.calendar.updateSizeOnTransitionEnd(document.querySelector('.nav'));
        this.calendar.updateSizeOnTransitionEnd(document.querySelector('.emails'));

    }

    setModel(model) {
        this.model = model;

        LabelsHandler.asignFunctions([
            [this.labels.inbox, this.model.getEmailsTo],
            [this.labels.sent, this.model.getEmailsFrom],
            [this.labels.draft, this.model.getDraftsFrom],
        ]);
    }

    async getUser(userId) {
        return await this.model.getUser(userId);
    }

    async createDraft() {
        const drafts = await this.model.getDraftsFrom(this.currentUser.id);
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
        if (this.currentLabel === this.labels.draft.name) this.render();
    }

    async deleteDraft(draftId) {
        this.model.deleteDraft(draftId);
        this.render();
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

        this.deleteDraft(draftId);

        alert('Correo Enviado!');
        this.render();
        return true;
    }

    async render() {
        this.currentUser = await this.model.getCurrentUser();
        document.querySelector('[data-username]').innerText = `${this.currentUser.name} ${this.currentUser.lastname}`;

        const { headers, fn } = Object.values(this.labels).find(label => label.name === this.currentLabel);

        this.header = headers;
        this.emails = await fn(this.currentUser.id);

        this.renderEmails();
    }

    // handleBackgroundText(message) {
    //     if (this.emails.length === 0) {
    //         this.backgroundTextEl.innerText = message;
    //         this.backgroundTextEl.style.display = 'none';
    //     } else {
    //         this.backgroundTextEl.style.display = '';
    //     }
    // }

    renderHeader() {
        const headerEl = document.querySelector('[data-emails-table-header]');
        headerEl.innerHTML = '';

        if (this.emails.length === 0) {
            headerEl.style.visibility = 'hidden';
        } else {
            headerEl.style.visibility = '';
            for (const headerItem of this.header) {
                const divEl = document.createElement('div');
                divEl.innerText = headerItem;
                headerEl.appendChild(divEl);
            }
        }
    }

    async renderEmails() {

        // this.handleBackgroundText('No hay Correos');

        this.renderHeader();

        document.querySelectorAll('.nav__item').forEach(item => item.classList.remove('selected'))
        document.querySelector(`.nav__item.${this.currentLabel}`).classList.add('selected');

        let html = '';
        for (const email of this.emails) {
            let user;

            if (this.currentLabel === 'DRAFT') {
                user = email.to_user; //String
            } else if (this.currentLabel === 'SENT') {
                user = await this.getUser(email.to_user);
            } else {
                user = await this.getUser(email.from_user);
            }
            html += this.createRow(email, user);
        }
        this.emailsContainer.innerHTML = html;

        this.handleEvents();
    }

    handleEvents() {
        const rows = [...this.emailsContainer.querySelectorAll('.email-row')];
        rows.forEach(row => {
            row.onclick = async (e) => {
                let target = e.target;
                while (!target.classList.contains('email-row')) {
                    target = target.parentElement;
                }
                const emailId = target.getAttribute('email-id');
                const draftId = target.getAttribute('draft-id');

                if (draftId) {
                    const draft = this.emails.find(draft => draft.id == draftId);

                    // todo: abrir el modal
                    this.draftModal.setValues(draft);
                    this.draftModal.modal.classList.toggle("active");
                } else {
                    const email = this.emails.find(email => email.id == emailId);
                    const fromUser = await this.getUser(email.from_user);
                    const toUser = await this.getUser(email.to_user);
                    this.emailContent.setValues(email, fromUser, toUser);

                    // todo: abrir el email
                    this.emailContent.openEmail();
                }
            }
        })
    }

    createRow(email, emailUser) {
        let user;

        if (emailUser) {
            user = typeof emailUser === 'object' ? `${emailUser.name} ${emailUser.lastname}` : emailUser;
        } else user = '(Sin Destinatario)';


        const subject = !email.subject ? '(Sin Asunto)' : email.subject;
        const message = !email.message ? '(Sin Mensaje)' : email.message;
        const date = formatTimestamp(email.date);

        const unread = !email.unread || this.currentLabel === 'SENT' ? '' : 'unread';

        let rowId = '';
        if (this.currentLabel === 'DRAFT')
            rowId = `draft-id="${email.id}"`;
        else
            rowId = `email-id="${email.id}"`;

        return `
            <div class="email-row ${unread}" ${rowId}">
                <div class="block"></div>
                <div class="user-field">${user}</div>
                <div class="subject-col">${subject}</div>
                <div class="message-field">${message}</div>
                <div class="date-field">${date}</div>
            </div>
        `;

    }

    handleWindowResize() {
        let isWitdhShort = false;

        const initialWidth = window.innerWidth;
        if (initialWidth < 768) {
            menuBtnEvent('add');
            isWitdhShort = true;
        }

        window.onresize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                if (!isWitdhShort) menuBtnEvent('add');
                isWitdhShort = true;
            } else {
                if (isWitdhShort) menuBtnEvent('remove');
                isWitdhShort = false;
            }
        }
    }
}
