const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./database");
const { compareSync } = require("bcrypt");

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'userpass'
},
    function (username, password, done) {
        UserModel.findOne({ username: username }).exec()
            .then(user => {
                if (!user) {
                    console.log("user 없음");
                    return done(null, false, { message: "회원정보가 없습니다." });
                }
                //비밀번호 조회
                if (!compareSync(password, user.userpass)) {
                    console.log("비밀번호가 틀림");
                    return done(null, false, { message: "비밀번호가 틀렸음" });
                }
                console.log(user);
                return done(null, user);
            })
            .catch(err => {
                console.log(err);
                return done(err);
            })

    }
));

//세션에서 id 정보를 가져옴
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


//id 정보를 받아 사용자 정보 가져옴
passport.deserializeUser(function (id, done) {
    UserModel.findById(id).exec()
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, null);
        });
});


