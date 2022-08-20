export default class Controller {
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

    async getUserEmails(labelId) {
        let url = `/api/users/me/emails/${labelId}`;
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

    changeEmailLabel(data) {
        this.sendJsonRequest('PATCH', '/api/users/me/emails', data);
    }

    createEvent(values) {
        this.sendJsonRequest('POST', '/api/users/me/events', values);
    }

    async editEvent(id, data) {
        this.sendJsonRequest('PUT', `/api/users/me/events/${id}`, data)
    }

    deleteEvent(id) {
        const request = new XMLHttpRequest();
        request.open('DELETE', `/api/users/me/events/${id}`);
        request.send();
    }

    sendJsonRequest(method, url, data) {
        const request = new XMLHttpRequest();
        request.open(method, url);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data))
    }
}