const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const { login } = require('./middlewares/login');
const path = require('path');

const router = require('./routes');
const authRouter = require('./routes/auth');

const app = express();

const port = process.env.PORT || 8080;

// control de sesión
app.use(sessions({
    secret: "misesionsecreta1",
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

// configurar archivos publicos
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));

// endpoints
app.get('/', login, (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
})

app.get('/login', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/singup', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/singup.html'));
})

app.listen(port, () => console.log(`Listening on port: ${port}`));