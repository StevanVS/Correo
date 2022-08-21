import Calendar from "./components/calendar.js";
import { formatTimestamp } from "./utils/dateFormater.js";
import DraftModal from "./components/draftModal.js";
import EmailAlert from "./components/emailAlert.js";
import EmailContent from "./components/emailContent.js";
import { expandNav, reduceNav } from "./main.js";

export default class View {
    constructor() {
        this.controller = null;
        this.currentUser = null;
        this.historyId = null;
        this.emails = null;

        this.currentLabel = {
            id: 'INBOX',
            name: 'Bandeja de Entrada',
        }

        this.emailsContainer = document.querySelector('[data-emails-rows]');
        this.emailAlert = new EmailAlert();

        this.emailContent = new EmailContent();

        this.emailContent.onDelete((values, newLabelId) => {
            // todo eliminar permanentemente
            if (this.currentLabel.id === 'DELETED') { }
            this.controller.changeEmailLabel({ values, newLabelId });
            this.render()
        })

        this.draftModal = new DraftModal();

        document.querySelectorAll('[data-label]').forEach(labelEl => {
            labelEl.onclick = e => {
                if (window.innerWidth < 992) reduceNav();
                const labelId = labelEl.getAttribute('label-id');
                if (labelId === this.currentLabel.id) return;
                this.currentLabel.id = labelId;
                this.currentLabel.name = labelEl.textContent;
                this.render();
            }
        })

        document.querySelector('[data-new-draft-btn]').onclick = async () => {
            this.createDraft();
        };

        this.draftModal.onEdit(async (draftId, values) => this.editDraft(draftId, values));
        this.draftModal.onSubmit(async (draftId, values) => this.sendEmail(draftId, values));


        this.calendar = new Calendar();

        this.#setCalendarEventListeners();
        this.handleWindowResize();
    }

    setController(controller) {
        this.controller = controller;
    }

    async createDraft() {
        const drafts = await this.controller.getUserEmails(['DRAFT']);
        const emptyDraft = drafts.find(draft => (
            !draft.subject && !draft.message && !draft.to_user
        ))

        if (!emptyDraft) {
            this.draftModal.emptyValues();
            const draftId = await this.controller.createDraft();
            this.draftModal.setDraftId(draftId);
        } else {
            this.draftModal.setValues(emptyDraft);
        }
        
        this.draftModal.show();

        this.render();
    }

    async editDraft(draftId, values) {
        await this.controller.editDraft(draftId, values)
        if (this.currentLabel.id === 'DRAFT') this.render();
    }

    async sendEmail(draftId, { to_user, subject, message }) {
        const toUser = await this.controller.getUserByEmail(to_user);
        if (!toUser || toUser == null) {
            alert('No existe usuario con el correo: ' + to_user);
            return false;
        }

        this.controller.sendEmail({
            from_user: this.currentUser.id,
            to_user: toUser.id,
            subject: subject,
            message: message,
        })

        this.controller.deleteDraft(draftId);

        alert('Correo Enviado!');
        this.render();
        return true;
    }

    async handleRefresh() {
        const newHistoryId = await this.controller.getHistoryId();
        if (newHistoryId !== this.historyId) {
            this.historyId = newHistoryId;
            this.render();
        }
    }

    async initView() {
        this.currentUser = await this.controller.getCurrentUser();
        document.querySelector('[data-username]').innerText = `${this.currentUser.name} ${this.currentUser.lastname}`;

        this.historyId = await this.controller.getHistoryId();
        this.render();
    }

    async render() {
        document.querySelectorAll('[data-label]').forEach(item => item.classList.remove('selected'))
        document.querySelector(`[label-id="${this.currentLabel.id}"]`).classList.add('selected');

        this.handleEmails();
    }

    async handleEmails() {
        //Empezar animacion email-loader
        this.emailsContainer.innerHTML = '<div class="lds-dual-ring"></div>';
        this.emailAlert.hide();

        this.emails = await this.controller.getUserEmails(this.currentLabel.id);
        if (this.emails.length === 0) {
            this.emailAlert.show(`La pestaña '${this.currentLabel.name}' está vacia`)
        }
        if (this.currentLabel.id === 'DELETED')
            this.emailAlert.show('Los Correos presentes en esta pestaña serán eliminados dentro de 30 días')

        //Terminar animacion loader
        this.emailsContainer.innerHTML = '';

        this.emails.forEach(email => {
            this.emailsContainer.appendChild(this.createEmailRow(email));
        })

    }

    createEmailRow(email) {
        const row = document.createElement('div');
        row.classList.add('email-row');

        if (email.unread && this.currentLabel.id !== 'SENT')
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

        const user = this.currentLabel.id === 'SENT' || this.currentLabel.id === 'DRAFT' ? email.to_user : email.from_user;
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
                this.draftModal.setValues(email);
                this.draftModal.show();
            } else {
                this.emailContent.openEmail(email);
            }
        }

        return row;
    }


    #setCalendarEventListeners() {
        this.calendar.onEventChange(async (id, values) => {
            return await this.controller.editEvent(id, values);
        });

        this.calendar.onCreateEvent(values => {
            this.controller.createEvent(values);
            this.calendar.refresh();
        });

        this.calendar.onEditEvent(event => {
            const { id, ...values } = event;
            this.controller.editEvent(id, values);
            this.calendar.refresh();
        })

        this.calendar.onDeleteEvent((id) => {
            this.controller.deleteEvent(id);
            this.calendar.refresh();
        })

    }

    handleWindowResize() {
        let isNavExpanded = true;
        let isCalendarClosed = false;
        window.onresize = () => {
            const breakPoints = {
                short: 425,
                medium: 768,
                large: 1024
            };

            const width = window.innerWidth;
            if (width > breakPoints.large) {
                if (!isNavExpanded) {
                    expandNav();
                    isNavExpanded = !isNavExpanded
                }

                this.calendar.resetNumberOfDays();
            } else {
                if (isNavExpanded) {
                    reduceNav();
                    isNavExpanded = !isNavExpanded
                }
                if (width > breakPoints.medium) {
                    if (isCalendarClosed) {
                        this.calendar.open();
                        isCalendarClosed = !isCalendarClosed;
                    }
                    this.calendar.changeNumberOfDays(4);
                } else {
                    this.calendar.close();
                    isCalendarClosed = true
                    this.calendar.changeNumberOfDays(3);
                }
            }
        }
        window.dispatchEvent(new Event('resize'))
    }

}
