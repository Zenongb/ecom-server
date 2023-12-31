import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import userManager from "../database/models/user.model.js"


passport.use('loginLocal', new LocalStrategy({
  usernameField: 'email'
}, async function verificationCallback(username, password, done) {
  try {
    console.log("in verification callback", username, password)
    const userData = await userManager.loginUser({ email: username, password: password })
    delete userData.loginHist, userData._id
    done(null, userData)
  } catch (err) {
    done(err)
  }
}))


passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()
