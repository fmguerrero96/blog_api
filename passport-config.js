const bcrypt = require('bcryptjs');
const User = require('./models/user');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'this_is_the_secret_key',
};

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id)

        if (user) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }
}));

