export default class Tooltip {
    constructor(el, values) {
        tippy(el, {
            content: this.#content(values),
            allowHTML: true,
            trigger: 'click',
            interactive: true,
            // placement: 'top',

        })
    }


    #content({ title, start, end, extendedProps: { description } }) {
        return `
        <div><strong>${title}</strong></div>
        <div>${start.toLocaleString('es')}</div>
        <div>${end ? end.toLocaleString('es') : ''}</div>
        <div>${description ? description : ''}</div>
        `;
    }

}