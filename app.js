const express = require("express");
const app = express();
const UserModel = require("./config/database");
const { hashSync } = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(session({
    secret: 'musecom net',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1/passport',
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

/** 패스포트  */
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("protected");
    }
    return res.render("login");
})
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("protected");
    }
    return res.render("login");
})

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/protected');
    });

app.get('/join', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("protected");
    }
    return res.render("join");
})
app.post("/join", (req, res) => {
    const user = new UserModel({
        username: req.body.username,
        userpass: hashSync(req.body.userpass, 10)
        //해시 함수를 이용해 암호화, 두 번째 인자로 salt 지정
    });
    user.save().then(user => console.log(user));
    res.send({ user })
});

app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("protected");
    }
    return res.status(401).send("권한이 없습니다.");
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return res.redirect('/protected', { err }) }
    });
    res.redirect('/login');
})

app.listen(4000, (req, res) => {
    console.log("4000번 포트에서 서버 실행중", "http://localhost:4000");
})