const httpError = (res, err) => {
    console.log(err)
    res.status(500)
    res.send({ error: 'Error Interno del Sistema' })
}

module.exports = { httpError }