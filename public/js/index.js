import View from "./view.js";
import Model from "./model.js";

const model = new Model();
const view = new View();

view.setModel(model);
model.setView(view);

view.render();

setInterval(function () {
    // view.chekUpdate();
    view.render();
    // console.log('Actualizado');
}, 5000);

