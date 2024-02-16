import { Router } from "express"

import { ROLE_VALUES } from "../config.js"
import { auth } from "../middlewares/authorization.middleware.js"

import { postController } from "../controllers/orders.controller.js"

export const ordersRouter = Router()

ordersRouter.post("/", auth(ROLE_VALUES._USER), postController)
