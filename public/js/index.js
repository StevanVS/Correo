import View from "./view.js";
import Controller from "./controller.js";

// const controller = new Controller();
const view = new View();

// view.setController(controller);
// controller.setView(view);

view.initView();

setInterval(() => {
    view.handleRefresh();
}, 5000);

