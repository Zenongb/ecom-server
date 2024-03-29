import { Router } from "express"
import {
  register,
  getCurrentUserController,
  updateUserController 
} from "../controllers/user.controller.js"
import passport from "passport"

export const usersRouter = Router()

usersRouter.post("/register", register)

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
