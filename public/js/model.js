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
}