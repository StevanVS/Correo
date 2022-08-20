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