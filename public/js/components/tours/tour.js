import Asistant from "../asistant.js";

export default class Tour {
    constructor(modal) {
        this.intro = introJs();
        this.onCompleteAndExit(() => Asistant.show());

        this.intro.setOptions({
            disableInteraction: true,
            nextLabel: "Siguiente",
            prevLabel: "Atras",
            doneLabel: "Finalizar",
        });

        if (modal) {
            this.intro.onchange((el) => {
                if (modal.modal.contains(el)) {
                    if (!modal.modal.open) modal.show();
                } else {
                    modal.close();
                }
            });
    
            this.onCompleteAndExit(() => {
                Asistant.show();
                modal.close();
            });
        }
    }

    start() {
        this.intro.start();
    }

    exit() {
        this.intro.exit();
    }

    onCompleteAndExit(callback) {
        this.intro.oncomplete(callback);
        this.intro.onexit(callback);
    }
}
