import Asistant from "../asistant.js";

export default class Tour {
    constructor() {
        this.intro = introJs();
        this.onCompleteAndExit(() => Asistant.show());

        this.intro.setOptions({
            disableInteraction: true,
            nextLabel: "Siguiente",
            prevLabel: "Atras",
            doneLabel: "Finalizar",
        });
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
