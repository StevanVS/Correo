export default class Modal {
    constructor(modalEl, closeBtnEl) {
        this.modal = modalEl;

        if (closeBtnEl) closeBtnEl.onclick = () => {
            this.close()
        };

        this.modal.onmousedown = e => {
            if (e.target.tagName === 'DIALOG') {
                this.close();
            }
        }
    }

    show() {
        this.modal.showModal();
        this.modal.style.top = 0;
    }

    close() {
        this.modal.style.top = '100vh';
        this.modal.style.left = '';
        this.modal.style.right = '';
        this.modal.close();
    }
}