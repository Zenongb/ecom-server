import { Router } from "express";
import { productsRouter } from "./products.router.js";
import { cartsRouter } from "./carts.router.js";
import { usersRouter } from "./users.router.js";

export const apiRouter = Router()

apiRouter.use("/", usersRouter)
apiRouter.use("/products", productsRouter)
apiRouter.use("/carts", cartsRouter)
