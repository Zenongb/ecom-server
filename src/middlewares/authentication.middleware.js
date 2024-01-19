import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GithubStrategy } from "passport-github2"
import UserManager from "../database/models/user.model.js"
import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config.js";

passport.use('loginLocal', new LocalStrategy({
  usernameField: 'email'
}, async function(username, password, done) {
  try {
    const userData = await UserManager.loginUser({ email: username, password: password })
    delete userData.loginHist, userData._id
    done(null, userData)
  } catch (err) {
    done(err)
  }
}))

passport.use("githubLogin", new GithubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL,
}, async function(_, __, profile, done) {
  let user
  try {
    user = await UserManager.loginUser({
      // caso en el que no exista email en el profile
      email: profile._json.email || profile._json.login,
    })
  } catch (err) {
    // agarramos el error not found para resolver el caso de
    // que no se haya un usuario registrado
    if (err.code === "ENOENT") {
      user = await UserManager.registerUser({
      email: profile.username,
    })
    } else {
      // es otro error
      done(err)    
    }
  }
  delete user.loginHist, user._id
  done(null, user)
}))


passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()
