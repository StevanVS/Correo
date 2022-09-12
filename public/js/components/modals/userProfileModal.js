import { closeSubMenu } from "../../main.js";
import Modal from "./Modal.js";

export default class UserProfileModal extends Modal {
  constructor() {
    super(document.querySelector("[data-user-profile-modal]"), []);

    this.form = this.modal.querySelector("[data-modal-form]");
    // this.imageInput = this.modal.querySelector("[data-user-img-input]");
    this.imageInput = this.form.userImg;

    document.querySelector("[data-user-profile]").onclick = () => {
      closeSubMenu();
      this.showModal();
    };
  }

  onChangeImage(callback) {
    this.imageInput.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        // console.log(result);
        callback(result);
      };
      if (this.imageInput.files.length > 0) {
        reader.readAsDataURL(this.imageInput.files[0]);
      }
    };
  }

  onSubmit(callback) {
    this.form.onsubmit = (e) => {
      e.preventDefault();
      // const data = new FormData(this.form)
      // console.log([...data.entries()]);

      // callback(); //todo pasar nuevos datos de usuario

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        console.log(result);
      };
      // console.log(this.file.files)
      if (this.imageInput.files.length > 0) {
        reader.readAsDataURL(this.imageInput.files[0]);
      }

      // console.log(this.form.result);
    };
  }
}
