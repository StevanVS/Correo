export default class Model {
    constructor() {
        this.view = null;

    }

    setView(view) {
        this.view = view;
    }

    async getCurrentUser() {
        const res = await fetch('/api/currentuser');
        const user = await res.json();
        return user;
    }

    async getUser(userId) {
        let user = await fetch(`/api/users/${userId}`).then(res => res.json());
        return user;
    }

    async getUserByEmail(emailAddress) {
        const result = await (await fetch(`/api/users/email/${emailAddress}`)).text();
        if (!result) return;
        const user = JSON.parse(result);
        return user;
    }

    async getEmailsFrom(userId) {
        const res = await fetch(`/api/emails/from/${userId}`);
        const emails = await res.json();
        return emails;
    }

    async getEmailsTo(userId) {
        const res = await fetch(`/api/emails/to/${userId}`);
        const emails = await res.json();
        return emails;
    }

    async getDraftsFrom(userId) {
        const emails = await fetch(`/api/emails/drafts/from/${userId}`).then(res => res.json());
        return emails;
    }

    async getHistoryId() {
        const historyId = await fetch('api/users/me/historyId').then(r => r.json());
        return historyId.id;
    }

    async getUserEmails(labelIds) {
        let url = '/api/users/me/emails?';

        if (labelIds) {
            labelIds.forEach(labelId => {
                url += `labelId=${labelId}&`
            });
        }
        
        const emails = await fetch(url).then(r => r.json());
        return emails;
    }

    async createDraft(currentUserId) {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/emails/drafts');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ from_user: currentUserId }));
    }

    async editDraft(id, values) {
        const request = new XMLHttpRequest();
        request.open('PUT', '/api/emails/drafts');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({
            id: id,
            ...values
        }));
    }

    async deleteDraft(id) {
        const request = new XMLHttpRequest();
        request.open('DELETE', `/api/emails/drafts/${id}`);
        request.send();
    }

    async sendEmail(values) {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/emails/send');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(values));
    }
}