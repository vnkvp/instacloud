const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user Model
const user = mongoose.model('User');

module.exports = (passport) => {
    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        // match user
        user.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {
                    message: 'No user Found'
                });
            }
            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Password incorrect'
                    });
                }
            });
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}