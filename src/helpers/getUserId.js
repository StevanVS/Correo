function getUserId(req) {
    const sessionUserId = req.session.userId;
    const userId = req.params.userId; 
    return ( userId === 'me' && sessionUserId) ? sessionUserId : userId;
}

module.exports = { getUserId };