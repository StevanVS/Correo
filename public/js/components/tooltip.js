export default class Tooltip {
    constructor(el, content) {
        tippy(el, {
            content: content,
        })
    }
}