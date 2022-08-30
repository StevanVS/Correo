const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const { login, singup } = require('./middlewares/auth');
const apicache = require('apicache');
const path = require('path');

const router = require('./routes');
const authRouter = require('./routes/auth');

const app = express();

const port = process.env.PORT || 8080;

// control de sesión
app.use(sessions({
    secret: "manolito23",
    saveUninitialized: true,
    cookie: {
        maxAge: null
    },
    resave: false,
}));

// para leer jsons y urls
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// rutas
app.use('/api', router);
app.use(authRouter);

// para usar cookies
app.use(cookieParser());

// Configuracion de Cache
// app.use(apicache.middleware('5 minutes'))

// configurar archivos publicos
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + '/css'));
// app.use('/js', express.static(__dirname + '/js'));
// app.use('/img', express.static(__dirname + '/img'));

// endpoints
app.get('/', login, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
})

app.get('/login-singup', singup, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/html/login-singup.html'));
});

app.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/users.html'))
})

app.listen(port, () => console.log(`Listening on port: ${port}`));