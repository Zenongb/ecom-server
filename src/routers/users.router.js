import { Router } from "express"
import {
  registerController,
  getCurrentUserController,
  updateUserController, 
  getUsersController
} from "../controllers/user.controller.js"
import { auth } from "../middlewares/authorization.middleware.js"
import { ROLE_VALUES } from "../config/constants.config.js"

import passport from "passport"

export const usersRouter = Router()

usersRouter.get("/users", auth(ROLE_VALUES._ADMIN), getUsersController)

usersRouter.post("/register", registerController)

usersRouter.post("/login", passport.authenticate("loginLocal", {failWithError: true}))

usersRouter.get("/githubLogin",
  passport.authenticate("githubLogin", {failWithError: true})
)

usersRouter.get("/githubCallback", passport.authenticate("githubLogin", {
  successRedirect: '/products',
  failureRedirect: '/login',
}))

usersRouter.get("/current", getCurrentUserController)

usersRouter.put("/users/:uid", updateUserController)
