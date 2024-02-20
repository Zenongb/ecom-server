import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as GithubStrategy } from "passport-github2"

import { userService } from "../services/index.service.js"

import {
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET 
} from "../config/env.config.js";

passport.use('loginLocal', new LocalStrategy({
  usernameField: 'email'
}, async function(username, password, done) {
  try {
    const userData = await userService.loginUser({ email: username, password: password })
    logger.log("debug", "in loginLocal", userData)
    delete userData.login_hist
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
  const [first_name, last_name, ...args] = profile._json.name.split(" ")
  let user
  try {
    user = await userService.loginUser({
      // caso en el que no exista email en el profile
      email: profile._json.email || profile._json.login,
      password: String(profile._json.id)
    })
    logger.log("debug", "in githublogin, user is", user)
  } catch (err) {
    // agarramos el error not found para resolver el caso de
    // que no se haya un usuario registrado
    if (err.code === "ENOENT") {
      user = await userService.registerUser({
        email: profile._json.email || profile._json.login,
        first_name,
        last_name,
        password: String(profile._json.id)
      })
        .catch(err => {
          done(err)
        })
    } else {
      // es otro error
      done(err)    
    }
  }
  logger.log("debug", "in githubLogin, user is", user)
  delete user?.login_hist
  done(null, user)
}))


passport.serializeUser((user, next) => { next(null, user) })
passport.deserializeUser((user, next) => { next(null, user) })

export const passportInitialize = passport.initialize()
export const passportSession = passport.session()
