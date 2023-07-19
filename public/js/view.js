import Calendar from "./components/calendar.js";
import { formatTimestamp } from "./utils/dateFormater.js";
import DraftModal from "./components/modals/draftModal.js";
import EmailContent from "./components/emailContent.js";
import LabelMessage from "./components/labelMessage.js";
import {
  expandNav,
  handleConfigMenuClose,
  handleNavClose,
  reduceNav,
  updateNavSize,
} from "./main.js";
import Alert from "./components/alert.js";
import Controller from "./controller.js";
import Asistant from "./components/asistant.js";
import GeneralTour from "./components/tours/generalTour.js";
import SupportModal from "./components/modals/support.js";
import breakPoints from "./utils/breakPoints.js";
import ThemeHandler from "./components/themeHandler.js";
import UserProfileModal from "./components/modals/userProfileModal.js";

export default class View {
  constructor() {
    this.controller = new Controller();

    this.currentUser = null;

    this.historyId = null;
    this.emails = [];

    this.asistant = new Asistant(); //* Inicializar el asistente
    this.generalTour = new GeneralTour(Asistant);
    this.themeHandler = new ThemeHandler();

    this.labelMessage = new LabelMessage();
    this.currentLabel = {
      id: "INBOX",
      name: "Bandeja de Entrada",
    };

    this.emailsContainer = document.querySelector("[data-emails-rows]");

    this.emailContent = new EmailContent();
    this.#setEmailContentEventListeners();

    this.draftModal = new DraftModal();
    this.#setDraftEventListeners();

    // this.userProfileModal = new UserProfileModal();
    // this.#setUserProfileEventListeners();

    this.supportModal = new SupportModal();

    document.querySelector("[data-new-draft-btn]").onclick = async () => {
      this.showLoader();
      await this.createDraft();
      this.hideLoader();
    };

    document.querySelectorAll("[data-label]").forEach((labelEl) => {
      labelEl.onclick = (e) => {
        this.emailContent.closeEmail();
        if (window.innerWidth < 992) reduceNav();

        const labelId = labelEl.getAttribute("label-id");
        if (labelId === this.currentLabel.id) return;

        this.currentLabel.id = labelId;
        this.currentLabel.name = labelEl.textContent;

        this.render();
      };
    });

    this.calendar = new Calendar();
    this.#setCalendarEventListeners();
    this.handleWindowResize();

    document.onmouseup = (e) => {
      handleConfigMenuClose(e);
      this.calendar.previewEventModal.handleModalClose(e);
      handleNavClose(e);
    };

    hotkeys("alt+shift+c", (e, h) => this.createDraft());
    hotkeys("alt+shift+e", (e, h) => this.calendar.createEvent());
  }

  async initView() {
    this.showLoader();
    this.currentUser = await this.controller.getCurrentUser();

    document.querySelectorAll("[data-username]").forEach((item) => {
      item.textContent = `${this.currentUser.name} ${this.currentUser.lastname}`;
    });
    document.querySelectorAll("[data-user-email-address]").forEach((item) => {
      item.textContent = this.currentUser.email_address;
    });

    document.querySelectorAll("[data-current-user-img]").forEach((item) => {
      if (this.currentUser.image_profile != null)
        item.style.content = `url(${this.currentUser.image_profile})`;
    });

    this.historyId = await this.controller.getHistoryId();

    this.render();

    this.maybeInitTour();
    this.hideLoader();
  }

  async createDraft() {
    const drafts = await this.controller.getUserEmails(["DRAFT"]);
    const emptyDraft = drafts.find(
      (draft) => !draft.subject && !draft.message && !draft.to_user
    );

    let draftId;
    if (!emptyDraft) {
      this.draftModal.emptyValues();
      draftId = await this.controller.createDraft();
      this.draftModal.setDraftId(draftId);
    } else {
      draftId = emptyDraft.id;
      this.draftModal.setValues(emptyDraft);
    }

    this.draftModal.showModal();

    this.render();
    return draftId;
  }

  async editDraft(draftId, values) {
    await this.controller.editDraft(draftId, values);
    if (this.currentLabel.id === "DRAFT") this.render();
  }

  async deleteDraft(draftId) {
    await this.controller.deleteDraft(draftId);
    if (this.currentLabel.id === "DRAFT") this.render();
  }

  async sendEmails(draftId, { toUserAddresses, subject, message }) {
    let toUserIds = [];
    if (toUserAddresses.every((v) => v === "all")) {
      const users = await this.controller.getUsers();
      for (const user of users) {
        if (user.id === this.currentUser.id) continue;
        toUserIds.push(user.id);
      }
    } else {
      for (const toUserAddress of toUserAddresses) {
        const user = await this.controller.getUserByEmail(toUserAddress);
        if (user == null) toUserIds.push(undefined);
        else toUserIds.push(user.id);
      }
    }

    const invalidAddressIndex = toUserIds.indexOf(undefined);
    if (invalidAddressIndex !== -1) {
      new Alert(
        `No existe usuario con el correo: ${toUserAddresses[invalidAddressIndex]}`,
        "error",
        this.draftModal.modal
      );
      return false;
    }

    await this.controller.sendEmails({ toUserIds, subject, message });
    await this.controller.deleteDraft(draftId);

    new Alert(`Correo Enviado a ${toUserAddresses.toString()}`, "info");
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

  async render() {
    document.querySelector("[data-label-title]").textContent =
      this.currentLabel.name;

    document
      .querySelectorAll("[data-label]")
      .forEach((item) => item.classList.remove("selected"));
    document
      .querySelector(`[label-id="${this.currentLabel.id}"]`)
      .classList.add("selected");

    this.handleEmails();
  }

  async handleEmails() {
    //Empezar animacion email-loader
    this.emailsContainer.innerHTML = '<div class="lds-dual-ring"></div>';
    this.labelMessage.hide();

    this.emails = await this.controller.getUserEmails(this.currentLabel.id);

    this.labelMessageControl();

    //Terminar animacion loader
    this.emailsContainer.innerHTML = "";

    this.emails.forEach((email) => {
      this.emailsContainer.prepend(this.createEmailRow(email));
    });
  }

  createEmailRow(email) {
    const row = document.createElement("div");
    row.classList.add("email-row");

    if (email.unread && this.currentLabel.id !== "SENT")
      row.classList.add("unread");

    row.innerHTML = `
            <div class="block"></div>
            <div class="user-icon-field user-img-container">
            </div>
            <div class="user-field text">
                <span class="draft-indicator">[Borrador]</span>
            </div>
            <div class="subject-field text"></div>
            <div class="message-field text"></div>
            <div class="date-field"></div>
        `;

    // Imagen de usuario
    const iconField = row.children[1];
    const img = document.createElement("img");
    img.className = "user-img";
    iconField.appendChild(img);

    // Campo del usuario
    const userField = row.children[2];

    if (email.label.id !== "DRAFT") userField.innerHTML = "";

    const user =
      this.currentLabel.id === "SENT" || this.currentLabel.id === "DRAFT"
        ? email.to_user
        : email.from_user;

    if (user) {
      userField.innerHTML +=
        email.label.id !== "DRAFT" ? `${user.name} ${user.lastname}` : user;
      if (user.image_profile != null)
        img.style.content = `url(${user.image_profile})`;
    } else {
      userField.innerHTML += "(Sin Destinatario)";
    }

    // Campo del asunto
    const subjectField = row.children[3];
    subjectField.textContent = !email.subject ? "(Sin Asunto)" : email.subject;

    // Campo del mensaje
    const messageField = row.children[4];
    messageField.textContent = !email.message ? "(Sin Mensaje)" : email.message;

    // Campo de la fecha
    const dateField = row.children[5];
    dateField.textContent = formatTimestamp(email.date);

    row.onclick = (e) => {
      if (email.label.id === "DRAFT") {
        this.draftModal.setValues(email);
        this.draftModal.showModal();
      } else {
        this.emailContent.openEmail(email);
        this.controller.editEmail(email.id, { unread: false });
        this.render();
      }
    };

    return row;
  }

  labelMessageControl() {
    if (this.emails.length === 0) {
      this.labelMessage.show(`No hay nada en ${this.currentLabel.name}`);
    }
    if (this.currentLabel.id === "DELETED") {
      this.labelMessage.showTrashLabelMessage();
    }
  }

  #setEmailContentEventListeners() {
    this.emailContent.onReply(async (values) => {
      this.showLoader();
      const drafts = await this.controller.getUserEmails(["DRAFT"]);
      const repitedDraft = drafts.find(
        (d) =>
          values.to_user === d.to_user &&
          values.subject === d.subject &&
          values.message === d.message
      );

      if (repitedDraft) {
        this.draftModal.setValues(repitedDraft);
        this.draftModal.showModal();
      } else {
        this.controller.createDraft();
        const id = await this.createDraft();
        this.draftModal.setValues({ id, ...values });
      }

      this.hideLoader();
    });

    this.emailContent.onChangeLabel((values, newLabelId) => {
      this.controller.changeEmailLabel({ values, newLabelId });
      this.render();
    }, this.controller.getUserLabels());

    this.emailContent.onDelete((emailId) => {
      this.controller.deleteEmail(emailId);
      this.render();
    });

    this.emailContent.createEventCallBack = (values) => {
      this.calendar.createEvent();
      this.calendar.eventDialog.setValues(values);
    };
  }

  #setDraftEventListeners() {
    this.draftModal.onEdit(async (draftId, values) => {
      this.showLoader();
      await this.editDraft(draftId, values);
      this.hideLoader();
    });
    this.draftModal.onSubmit(async (draftId, values) => {
      this.showLoader();
      const wasEmailSent = await this.sendEmails(draftId, values);
      this.hideLoader();
      return wasEmailSent;
    });
    this.draftModal.onDelete(async (draftId) => {
      this.showLoader();
      await this.deleteDraft(draftId);
      this.hideLoader();
    });
  }

  #setCalendarEventListeners() {
    this.calendar.onEventChange(async (id, values) => {
      this.showLoader();
      const result = await this.controller.editEvent(id, values);
      this.hideLoader();
      return result;
    });

    this.calendar.onCreateEvent((values) => {
      this.controller.createEvent(values);
      this.calendar.refresh();
    });

    this.calendar.onEditEvent((event) => {
      const { id, ...values } = event;
      this.controller.editEvent(id, values);
      this.calendar.refresh();
    });

    this.calendar.onDeleteEvent((id) => {
      this.controller.deleteEvent(id);
      this.calendar.refresh();
    });
  }

  #setUserProfileEventListeners() {
    this.userProfileModal.onChangeImage((imgData) => {
      this.controller.editUser({ image_profile: imgData });
      document.querySelectorAll(".user-img").forEach((item) => {
        item.style.content = `url(${imgData})`;
      });
    });
  }

  handleWindowResize() {
    let isNavExpanded = true;
    window.onresize = () => {
      this.calendar.updateSize();
      updateNavSize();
    };
    window.dispatchEvent(new Event("resize"));
  }

  maybeInitTour() {
    // if (window.innerWidth > 425) {this.tour.start();}

    if (window.innerWidth < breakPoints.short) {
      this.calendar.close();
      this.asistant.toggleAsistantBtn.style.display = "none";
    } else {
      // Asistant.setActive(true)
      if (this.currentUser.newuser) {
        this.generalTour.start();
        this.controller.editUser({ newuser: false });
      } else {
        this.generalTour.exit();
      }
    }
  }

  showLoader() {
    document.querySelector("[data-general-loader]").style.display = "block";
  }
  hideLoader() {
    document.querySelector("[data-general-loader]").style.display = "none";
  }
}
