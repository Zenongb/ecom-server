import { Router } from "express"
import {
  register,
  login
} from "../controllers/user.controller.js"

export const usersRouter = Router()

usersRouter.post("/register", register)
usersRouter.post("/login", login)
