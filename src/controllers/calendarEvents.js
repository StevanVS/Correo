const { query } = require('../connection');
const { getUserId } = require('../helpers/getUserId');
const { httpError } = require('../helpers/handleError');


async function getUserEvents(req, res) {
    try {
        const userId = getUserId(req);

        const sql = 'select * from calendar_events where user_id = ?';
        const results = await query(sql, userId);

        const events = results.map(result => {
            return {
                id: result.id,
                title: result.title,
                start: result.start,
                end: result.end,
                allDay: !!result.all_day,
                extendedProps: {
                    description: result.description
                },
            }
        });

        res.send(events);
    } catch (err) {
        httpError(res, err);
    }
}

async function createEvent(req, res) {
    try {
        const userId = getUserId(req);
        const values = {
            user_id: userId,
            ...req.body,
        }

        const sql = 'insert into calendar_events set ?';
        const result = await query(sql, values);
        res.send(result)
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

//DELETE /api/users/:userId/events/:eventId
async function deleteEvent(req, res) {
    try {
        const userId = getUserId(req);
        const { eventId } = req.params;

        const sql = 'delete from calendar_events where id = ? and user_id = ?';
        const result = await query(sql, [eventId, userId]);

        res.send(result);
    } catch (err) {
        httpError(res, err);
    }
}


module.exports = {
    getUserEvents,
    createEvent,
    editEvent,
    deleteEvent,
}