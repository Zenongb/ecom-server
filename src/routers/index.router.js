import { Router } from "express";

import { usersRouter } from "./users.router.js";
import { apiRouter } from "./api.router.js"
import { webRouter } from "./web.router.js";

export const indexRouter = Router()


indexRouter.use("/", usersRouter)
indexRouter.use("/", webRouter)
indexRouter.use("/api", apiRouter)
