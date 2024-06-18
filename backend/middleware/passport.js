const passport = require('passport');

const USER = require('./model/userSchema');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
},
    async (acessToken, refreshToken, profile, done) => {
        try {
            //checking for user
            let user = await USER.findOne({ email: profile.emails[0].value });
           
            //creating new user
            if (!user) {
                 user= new USER({
                    name: profile.displayName,
                    isVerified: true,
                    email: profile.emails[0].value,
                    profileImageUrl:profile.photos[0].value,
                    password: `${profile.id} + ${Date.now()}`,
                   
                })
                await user.save();
                console.log('user saved succesfully');
            } 
            else if(user.profileImageUrl!==profile.photos[0].value){
                user.profileImageUrl=profile.photos[0].value;
                await user.save();
            } 

              return done(null, user);
            

        } catch (err) {
            return done(err, profile);
        }

    }))

module.exports = passport;