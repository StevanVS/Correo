export default class View {
    constructor() {
        this.model = null;
        this.currentUser = null;
        this.emails = null;

        document.querySelector('[data-inbox-label]').onclick = async () => {
            this.emails = await this.getEmailsTo(this.currentUser.id);
            this.renderEmails();
        }

        document.querySelector('[data-sents-label]').onclick = async () => {
            this.emails = await this.getEmailsFrom(this.currentUser.id);
            this.renderEmails();
        }

        document.querySelector('[data-drafts-label]').onclick = async () => {
            this.emails = await this.getDraftsFrom(this.currentUser.id);
            this.renderEmails();
        }

        // todo: 


    }

    setModel(model) {
        this.model = model;
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



    async render() {
        this.currentUser = await this.getCurrentUser();
        this.emails = await this.getEmailsTo(this.currentUser.id);
        
        await this.renderEmails();




    }
// todo: crear cabezera
    async renderEmails() {
        const container = document.querySelector('[data-emails-rows]');
        let html = '';
        for (const email of this.emails) {
            const fromUser = await this.getUser(email.from_user);
            html += this.createRow(email, fromUser);
        }
        container.innerHTML = html;
    }

    createRow(email, fromUser) {
        return `
            <div class="email-row">
                <div class="from-field">${fromUser.name} ${fromUser.lastname}</div>
                <div class="subject-col">${email.subject}</div>
                <div class="message-field">${email.message}</div>
            </div>
        `;
    }
}