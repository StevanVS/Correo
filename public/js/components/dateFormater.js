export default function formatTimestamp(timestamp) {
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
