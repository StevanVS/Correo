export default class View {
    constructor() {
        this.model = null;
        this.currentUser = null;
        this.emails = null;
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

    async render() {
        this.currentUser = await this.getCurrentUser();
        // console.log(this.currentUser);
        this.emails = await this.getEmailsTo(this.currentUser.id);

        const tableBody = document.querySelector('[data-emails-table-body]');
        let html = '';
        for (const email of this.emails) {
            const fromUser = await this.getUser(email.from_user);
            html += this.createRow(email, fromUser);
        }
        tableBody.innerHTML = html;
    }

    createRow(email, fromUser) {
        return `
            <tr>
                <td>${fromUser.name} ${fromUser.lastname}</td>
                <td>${email.subject}</td>
                <td><div class="snippet">${email.message}</div></td>
            </tr>
        `;
    }
}