const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
];

export function formatTimestamp(timestamp) {
    const emailDate = new Date(timestamp);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDays = new Date();
    twoDays.setHours(0, 0, 0, 0);
    twoDays.setDate(today.getDate() - 2);

    let options = {};
    if (emailDate.getTime() < twoDays.getTime()) {
        options = { weekday: 'short', day: 'numeric', month: 'numeric' }
    }

    if (emailDate.getTime() < today.getTime()) {
        options = { weekday: 'short', hour: 'numeric', minute: 'numeric' };
    }

    if (emailDate.getTime() > today.getTime()) {
        options = { hour: 'numeric', minute: 'numeric' };
    }

    return emailDate.toLocaleString('es-EC', options);
}

export function formatDate(date) {
    let month = date.getMonth();
    month++;
    month = toTwoDigits(month);

    const day = toTwoDigits(date.getDate())

    let year = date.getFullYear();

    const hours = toTwoDigits(date.getHours())

    const min = toTwoDigits(date.getMinutes());

    const dateString = `${year}-${month}-${day}T${hours}:${min}`;
    console.log(dateString);
    return dateString;
}

function toTwoDigits(v) {
    return v.toString().length === 1 ? `0${v}` : v;
}

export function getDateFromDatetimeStr(datetimesArr) {
    const datetimes = [
        [datetimesArr[0], datetimesArr[1]],
        [datetimesArr[2], datetimesArr[3]],
    ];

    const dates = datetimes.map(datetime => {
        const [d, m, y] = formatDateStr(datetime[0]);
        let [h, min] = formatTimeStr(datetime[1]);

        h = h ? h : '00';
        min = min ? min : '00';

        return new Date(`${y}-${m}-${d}T${h}:${min}`);
    })

    return dates;
}

function formatDateStr(dateStr) {
    try {
        const fields = dateStr.split(/[/.-]/g);
        return fields.map(n => n.length === 1 ? toTwoDigits(n) : n)
    } catch (error) {
        return [];
    }
}

function formatTimeStr(timeStr) {
    try {
        const fields = timeStr.match(/\d{1,2}|[ap]m/gi)

        fields[0] = toTwoDigits(fields[0]);

        if (fields.length === 2) fields.splice(1, 0, '00');

        if (!isNaN(fields[3])) return [];

        const isPM = fields[2].toUpperCase() === 'PM';

        if (fields[0] == 12 && !isPM) fields[0] = parseInt(fields[0]) - 12;
        if (isPM && fields[0] != 12) fields[0] = parseInt(fields[0]) + 12;

        return fields;
    } catch (error) {
        return [];
    }
}

export function fromStringDateToDateObj(value) {
    let d = value[1];

    let m = months.indexOf(value[2]);
    if (m === -1) {
        console.log('vales caca');
        return;
    }

    let y;
    if (value[3] == null) y = new Date().getFullYear();
    else y = value[3];

    let h = 0;
    let min = 0;
    if (value[4] != null) {
        h = value[4];

        if (value[5] != null) min = value[5];
    }


    let isTwelveDigits = (h <= 12);
    let isPM;
    if (value[6] != null) {
        if (value[6].toUpperCase() === 'PM') isPM = true;
        else isPM = false;
    }

    if (isTwelveDigits && isPM != null) {
        if (h == 12 && !isPM) h = parseInt(h) - 12;
        if (isPM && h != 12) h = parseInt(h) + 12;
    }

    // console.log({ y, m, d, h, min });
    const date = new Date(y, m, d, h, min);
    return date;
}