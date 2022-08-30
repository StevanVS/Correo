export default class Modal {
    constructor(modalEl, closeBtnEls) {
        this.modal = modalEl;

        closeBtnEls.forEach((closeBtnEl) => {
            closeBtnEl.onclick = () => {
                this.close();
            };
        });

        this.modal.onmousedown = (e) => {
            if (e.target.tagName === "DIALOG") {
                this.close();
            }
        };
    }

    showModal() {
        this.modal.showModal();
        this.modal.style.top = 0;
        this.modal.style.margin = "auto";

        this.modal.style.visibility = "visible";
        this.modal.style.opacity = 1;
    }

    show() {
        this.modal.classList.add("no-modal");
        this.modal.show();

        this.modal.style.visibility = "visible";
        this.modal.style.opacity = 1;
    }

    close() {
        this.modal.classList.remove("no-modal");

        this.modal.style.margin = 0;
        this.modal.style.top = "100vh";
        this.modal.style.left = "";
        this.modal.style.right = "";
        this.modal.close();

        this.modal.style.visibility = "hidden";
        this.modal.style.opacity = 0;
    }
}
