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
        this.historyId = null;
        this.emails = null;
        this.header = null;

        this.labels = LabelsHandler.labels;
        this.currentLabel = this.labels.inbox.name;
        this.currentLabelId = 'INBOX'

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

    }

    setModel(model) {
        this.model = model;

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
    }

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

    }

    handleEvents() {
        
    }

    createRow() {
        
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
        if (initialWidth < 992) {
            menuBtnEvent('add');
            isWitdhShort = true;
        }

        window.onresize = () => {
            const width = window.innerWidth;
            if (width < 992) {
                if (!isWitdhShort) menuBtnEvent('add');
                isWitdhShort = true;
            } else {
                if (isWitdhShort) menuBtnEvent('remove');
                isWitdhShort = false;
            }
        }
    }
}
