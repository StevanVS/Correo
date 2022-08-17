const { query } = require('../connection');
const { getUserId } = require('../helpers/getUserId');
const { httpError } = require('../helpers/handleError');


async function getUserEvents(req, res) {
    try {
        const userId = getUserId(req);

        const sql = 'select * from calendar_events where user_id = ?';
        const results = await query(sql, userId);

        const events = [];

        results.forEach(result => {
            const event = {
                id: result.id,
                title: result.title,
                start: result.start,
                end: result.end,
                extendedProps: {
                    description: result.description
                },
            }
            events.push(event);
        })

        res.send(events);
    } catch (err) {
        httpError(res, err);
    }
}

//PUT /api/users/:userId/events/:eventId
async function editEvent(req, res) {
    try {
        const userId = getUserId(req);
        const { eventId } = req.params;
        const values = req.body

        const sql = 'update calendar_events set ? where id = ? and user_id = ?';
        const result = await query(sql, [values, eventId, userId]);

        res.send(result);
    } catch (err) {
        httpError(res, err);
    }
}

module.exports = {
    getUserEvents,
    editEvent,
}