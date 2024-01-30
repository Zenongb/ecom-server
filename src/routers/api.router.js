import { Router } from "express";
import { productsRouter } from "./products.router.js";
import { cartsRouter } from "./carts.router.js";
import { usersRouter } from "./users.router.js";
import errorMiddleware from "../middlewares/error.middleware.js"

export const apiRouter = Router()

apiRouter.use("/api", usersRouter)
apiRouter.use("/products", productsRouter)
apiRouter.use("/carts", cartsRouter)
apiRouter.use(errorMiddleware)
