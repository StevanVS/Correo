import Calendar from "./components/calendar.js";
import { formatTimestamp } from "./utils/dateFormater.js";
import DraftModal from "./components/modals/draftModal.js";
import EmailContent from "./components/emailContent.js";
import LabelMessage from "./components/labelMessage.js";
import { expandNav, handleConfigMenuClose, handleNavClose, reduceNav } from "./main.js";
import Alert from "./components/alert.js";
import Controller from "./controller.js";
import Tour from "./components/tour.js";
import Asistant from "./components/asistant.js";

export default class View {
    constructor() {
        this.controller = new Controller();

        this.currentUser = null;

        this.historyId = null;
        this.emails = null;

        this.labelMessage = new LabelMessage();
        this.currentLabel = {
            id: 'INBOX',
            name: 'Bandeja de Entrada',
        }

        this.emailsContainer = document.querySelector('[data-emails-rows]');

        // document.querySelector('[data-edit-user-profile-btn]').onclick = () => {
        //     this.userProfileModal.showModal();
        // }

        this.emailContent = new EmailContent()
        this.#setEmailContentEventListeners();

        this.draftModal = new DraftModal();

        this.draftModal.onEdit(async (draftId, values) => this.editDraft(draftId, values));
        this.draftModal.onSubmit(async (draftId, values) => this.sendEmail(draftId, values));


        document.querySelector('[data-new-draft-btn]').onclick = () => this.createDraft();

        document.querySelectorAll('[data-label]').forEach(labelEl => {
            labelEl.onclick = e => {
                this.emailContent.closeEmail();
                if (window.innerWidth < 992) reduceNav();

                const labelId = labelEl.getAttribute('label-id');
                if (labelId === this.currentLabel.id) return;

                this.currentLabel.id = labelId;
                this.currentLabel.name = labelEl.textContent;

                this.render();
            }
        })

        this.calendar = new Calendar();

        this.#setCalendarEventListeners();
        this.handleWindowResize();

        document.onmouseup = e => {
            handleConfigMenuClose(e);
            this.calendar.previewEventModal.handleModalClose(e);
            handleNavClose(e);
        }
    }

    async createDraft() {
        const drafts = await this.controller.getUserEmails(['DRAFT']);
        const emptyDraft = drafts.find(draft => (
            !draft.subject && !draft.message && !draft.to_user
        ))

        let draftId;
        if (!emptyDraft) {
            this.draftModal.emptyValues();
            draftId = await this.controller.createDraft();
            this.draftModal.setDraftId(draftId);
        } else {
            this.draftModal.setValues(emptyDraft);
        }

        this.draftModal.showModal();

        this.render();
        return draftId;
    }

    async editDraft(draftId, values) {
        await this.controller.editDraft(draftId, values)
        if (this.currentLabel.id === 'DRAFT') this.render();
    }

    async sendEmail(draftId, { to_user: userAddress, subject, message }) {
        const toUser = await this.controller.getUserByEmail(userAddress);
        if (!toUser || toUser == null) {
            // alert('No existe usuario con el correo: ' + userAddress);
            new Alert(`No existe usuario con el correo: ${userAddress}`, 'error', this.draftModal.modal);
            return false;
        }

        this.controller.sendEmail({
            from_user: this.currentUser.id,
            to_user: toUser.id,
            subject: subject,
            message: message,
        })

        this.controller.deleteDraft(draftId);

        // alert('Correo Enviado!');
        new Alert(`Correo Enviado con Éxito a ${toUser.name}`, 'success')
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

        document.querySelectorAll('[data-username]').forEach(item => {
            item.textContent = `${this.currentUser.name} ${this.currentUser.lastname}`;
        })
        document.querySelectorAll('[data-user-email-address]').forEach(item => {
            item.textContent = this.currentUser.email_address
        })

        this.historyId = await this.controller.getHistoryId();

        const asistant = new Asistant();
        const tour = new Tour();
        tour.onCompleteAndExit(() => asistant.init());
        if (this.currentUser.newuser) {
            //TODO: ACCIONAR AL ROBOT
            tour.start();

            this.controller.editUser({ newuser: false });
        } else {
            tour.exit();
        }

        this.render();
    }

    async render() {

        document.querySelector('[data-label-title]').textContent = this.currentLabel.name;

        document.querySelectorAll('[data-label]').forEach(item => item.classList.remove('selected'))
        document.querySelector(`[label-id="${this.currentLabel.id}"]`).classList.add('selected');

        this.handleEmails();
    }

    async handleEmails() {
        //Empezar animacion email-loader
        this.emailsContainer.innerHTML = '<div class="lds-dual-ring"></div>';
        this.labelMessage.hide();

        this.emails = await this.controller.getUserEmails(this.currentLabel.id);

        if (this.emails.length === 0) {
            this.labelMessage.show(`No hay nada en ${this.currentLabel.name}`)
        }
        if (this.currentLabel.id === 'DELETED')
            this.labelMessage.showTrashLabelMessage();

        //Terminar animacion loader
        this.emailsContainer.innerHTML = '';

        this.emails.forEach(email => {
            this.emailsContainer.prepend(this.createEmailRow(email));
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
                this.draftModal.showModal();
            } else {
                this.emailContent.openEmail(email);
                this.controller.editEmail(email.id, { unread: false })
                this.render()
            }
        }

        return row;
    }

    #setEmailContentEventListeners() {
        this.emailContent.onReply(async draft => {
            const id = await this.createDraft();
            this.draftModal.setValues({ id, ...draft });
        });

        this.emailContent.onChangeLabel((values, newLabelId) => {
            this.controller.changeEmailLabel({ values, newLabelId });
            this.render()
        }, this.controller.getUserLabels());

        this.emailContent.onDelete((emailId) => {
            this.controller.deleteEmail(emailId)
            this.render()
        });

        this.emailContent.createEventCallBack = (values) => {
            this.calendar.createEvent();
            this.calendar.eventDialog.setValues(values);
        }
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
                    this.calendar.changeNumberOfDays(4);
                } else {
                    this.calendar.changeNumberOfDays(3);
                }
            }
        }
        window.dispatchEvent(new Event('resize'))
    }

}
