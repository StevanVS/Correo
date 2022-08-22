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

    async editUser(data) {
        return await this.#fetch('PUT', '/api/users/me', data);
    }

    async getUserByEmail(emailAddress) {
        const result = await (await fetch(`/api/users/email/${emailAddress}`)).text();
        if (!result) return;
        const user = JSON.parse(result);
        return user;
    }

    async getUserLabels() {
        return await this.#fetch('GET', '/api/users/me/labels');
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

    async editEmail(emailId, data) {
        return await this.#fetch('PUT', `/api/users/me/emails/${emailId}`, data);
    }

    async deleteEmail(emailId) {
        return await this.#fetch('DELETE', `/api/users/me/emails/${emailId}`);
    }

    async createDraft() {
        const result = this.#fetch('POST', '/api/users/me/drafts');
        return result.insertId;
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
        this.#fetch('DELETE', `/api/users/me/drafts/${id}`);
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
        const result = await this.#fetch('PUT', `/api/users/me/events/${id}`, data);
        return result;
    }

    deleteEvent(id) {
        const request = new XMLHttpRequest();
        request.open('DELETE', `/api/users/me/events/${id}`);
        request.send();
    }

    async sendJsonRequest(method, url, data) {
        const request = new XMLHttpRequest();
        request.onload = () => { console.log(JSON.parse(request.response)) };
        request.open(method, url);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
    }

    async #fetch(method, url, data) {
        const options = {
            method,
            body: data ? JSON.stringify(data) : null,
            headers: { "Content-Type": "application/json" }
        }
        const result = await fetch(url, options).then(r => r.json());
        return result;
    }
}