import { closeSubMenu } from "../../main.js";
import Modal from "./modal.js";

export default class SupportModal extends Modal {
    constructor() {
        super(document.querySelector("[data-support-modal]"), []);

        document.querySelector("[data-support-btn]").onclick = () => {
            closeSubMenu();
            this.showModal();
        };
    }
}
