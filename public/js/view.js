import EmailModal from "./components/emailModal.js";

export default class View {
    constructor() {
        this.model = null;
        this.currentUser = null;
        this.emails = null;
        this.header = null;
        this.currentLabel = 'INBOX';

        this.emailModal = new EmailModal();

        document.querySelector('[data-inbox-label]').onclick = async () => this.renderInbox();
        document.querySelector('[data-sents-label]').onclick = async () => this.renderSents();
        document.querySelector('[data-drafts-label]').onclick = async () => this.renderDrafts();

        document.querySelector('[data-new-draft-btn]').onclick = async () => this.createDraft();

        this.emailModal.onKeyUp((id, values) => this.editDraft(id, values));
    }

    setModel(model) {
        this.model = model;
    }

    async renderInbox() {
        this.currentLabel = 'INBOX';
        this.header = ['De', 'Asunto', 'Mensaje', 'Recibido'];
        this.emails = await this.getEmailsTo(this.currentUser.id);
        this.renderEmails();
    }

    async renderSents() {
        this.currentLabel = 'SENT';
        this.header = ['Para', 'Asunto', 'Mensaje', 'Enviado'];
        this.emails = await this.getEmailsFrom(this.currentUser.id);
        this.renderEmails();
    }

    async renderDrafts() {
        this.currentLabel = 'DRAFT';
        this.header = ['Para', 'Asunto', 'Mensaje', 'Creado'];
        this.emails = await this.getDraftsFrom(this.currentUser.id);
        this.renderEmails();
    }

    async getCurrentUser() {
        return await this.model.getCurrentUser();
    }

    async getUser(userId) {
        return await this.model.getUser(userId);
    }

    async getEmailsFrom(userId) {
        return this.model.getEmailsFrom(userId);
    }

    async getEmailsTo(userId) {
        return this.model.getEmailsTo(userId);
    }

    async getDraftsFrom(userId) {
        return this.model.getDraftsFrom(userId);
    }

    async createDraft() {
        this.model.createDraft(this.currentUser.id);
    }

    async editDraft(id, values) {
        this.model.editDraft(id, values)
    }

    async render() {
        this.currentUser = await this.getCurrentUser();
        document.querySelector('[data-username]').innerText =
            `${this.currentUser.name} ${this.currentUser.lastname}`;
        switch (this.currentLabel) {
            case 'INBOX':
                this.renderInbox();
                break;
            case 'SENT':
                this.renderSents();
                break;
            case 'DRAFT':
                this.renderDrafts();
                break;
        }
        // console.log('Renderizado');
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
        this.renderHeader();
        const container = document.querySelector('[data-emails-rows]');
        let html = '';
        for (const email of this.emails) {
            let user;

            if (this.currentLabel === 'DRAFT' || this.currentLabel === 'SENT') {
                if (email.to_user == null) {
                    user = null;
                } else {
                    user = await this.getUser(email.to_user);
                }
            } else {
                user = await this.getUser(email.from_user);
            }

            html += this.createRow(email, user);
        }
        container.innerHTML = html;
        
        const rows = [...container.querySelectorAll('.email-row')];
        rows.forEach(row => {
            row.onclick = (e) => {
                let target = e.target;
                while (!target.classList.contains('email-row')) {
                    target = target.parentElement;
                }
                const emailId = target.getAttribute('email-id');
                const draftId = target.getAttribute('draft-id');

                if (draftId) {
                    const draft = this.emails.find(email => email.id == draftId);
                    
                    this.emailModal.setValues(draft);
                    // todo: abrir el modal
                } else {
                    // todo: abrir el email
                }

            }
        })
    }

    formatTimestamp(timestamp) {
        const emailDate = new Date(timestamp);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const twoDays = new Date();
        twoDays.setHours(0, 0, 0, 0);
        twoDays.setDate(today.getDate() - 2);

        let options = {};
        if (emailDate.getTime() < twoDays.getTime()) {
            options = { weekday: 'short', day: 'numeric', month: 'numeric' }
        }

        if (emailDate.getTime() < today.getTime()) {
            options = { weekday: 'short', hour: 'numeric', minute: 'numeric' };
        }

        if (emailDate.getTime() > today.getTime()) {
            options = { hour: 'numeric', minute: 'numeric' };
        }

        return emailDate.toLocaleString('es-EC', options);
    }

    createRow(email, emailUser) {
        const user = emailUser == null ? '(Sin Destinatario)' : `${emailUser.name} ${emailUser.lastname}`;
        const subject = email.subject == null || email.subject.length === 0 ? '(Sin Asunto)' : email.subject;
        const message = email.message == null || email.message.length === 0 ? '(Sin Mensaje)' : email.message;
        const date = this.formatTimestamp(email.date);

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
}