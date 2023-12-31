import { Router } from "express"
import {
  register,
  login
} from "../controllers/user.controller.js"
import passport from "passport"

export const usersRouter = Router()

usersRouter.post("/register", register)
usersRouter.post("/login", passport.authenticate("loginLocal", {failWithError: true}))
