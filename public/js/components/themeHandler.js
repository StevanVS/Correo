export default class ThemeHandler {
    #LOCAL_STORAGE_KEY = "imail.theme";
    constructor() {
        this.DARK_MODE = "darkmode";

        this.toggleBtn = document.querySelector("[data-toggle-dark-theme-btn]");
        this.btnText = this.toggleBtn.querySelector("span");
        this.btnIcon = this.toggleBtn.querySelector("i");

        if (this.getTheme() === this.DARK_MODE) {
            this.clearTheme();
            this.btnText.textContent = "Modo Claro";
            this.btnIcon.className = "fa-solid fa-sun";
            this.setTheme(this.DARK_MODE);
        } else {
            this.btnText.textContent = "Modo Oscuro";
            this.btnIcon.className = "fa-solid fa-moon";
            this.clearTheme();
        }

        this.toggleBtn.onclick = () => {
            console.log("clok");
            if (this.getTheme() === this.DARK_MODE) {
                this.clearTheme();
                this.btnText.textContent = "Modo Oscuro";
                this.btnIcon.className = "fa-solid fa-moon";
            } else {
                this.clearTheme();
                this.btnText.textContent = "Modo Claro";
                this.btnIcon.className = "fa-solid fa-sun";
                this.setTheme(this.DARK_MODE);
            }
        };
    }

    getTheme() {
        return localStorage.getItem(this.#LOCAL_STORAGE_KEY) || "";
    }

    setTheme(theme) {
        document.querySelector("body").classList.add(theme);
        localStorage.setItem(this.#LOCAL_STORAGE_KEY, theme);
    }

    clearTheme() {
        document.querySelector("body").className = "";
        localStorage.setItem(this.#LOCAL_STORAGE_KEY, "");
    }
}
