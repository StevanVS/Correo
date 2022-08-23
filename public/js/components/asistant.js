export default class Asistant {
    #asistant = document.querySelector(".asistente");
    show() {
        this.#asistant.style.display = 'block';
    }

    hide() {
        this.#asistant.style.display = 'none';
    }

    init() {
        const asistente = document.querySelector(".asistente");
        this.show()

        asistente.onmousedown = function (event) {
            let shiftX = event.clientX - asistente.getBoundingClientRect().left;
            let shiftY = event.clientY - asistente.getBoundingClientRect().top;

            asistente.style.position = 'absolute';
            asistente.style.zIndex = 1000;
            document.body.append(asistente);

            moveAt(event.pageX, event.pageY);

            function moveAt(pageX, pageY) {
                asistente.style.left = pageX - shiftX + 'px';
                asistente.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            asistente.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                asistente.onmouseup = null;
            };
        };

        asistente.ondragstart = function () {
            return false;
        };


        let drag = false;
        asistente.addEventListener('mousedown', () => drag = false);

        asistente.addEventListener('mousemove', () => drag = true);

        asistente.addEventListener('mouseup', () => {
            console.log(drag ? 'drag' : 'click')
        });
    }
}