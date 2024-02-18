import { Router } from "express";

import { usersRouter } from "./users.router.js";
import { apiRouter } from "./api.router.js"
import { webRouter } from "./web.router.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import { mockingProducts } from "../controllers/products.controller.js";

export const indexRouter = Router()


indexRouter.use("/", webRouter)
indexRouter.use("/", usersRouter, errorMiddleware)
// READ MOCK
indexRouter.get("/mockingproducts", mockingProducts, errorMiddleware)

indexRouter.use("/api", apiRouter, errorMiddleware)
