import View from "./view.js";
const view = new View();

view.initView();

setInterval(() => {
    view.handleRefresh();
}, 5000);

