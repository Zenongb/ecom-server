import { Router } from "express";
import { productsRouter } from "./products.router.js";
import { cartsRouter } from "./carts.router.js";
import { ordersRouter } from "./orders.router.js";

export const apiRouter = Router()

apiRouter.use("/products", productsRouter)
apiRouter.use("/carts", cartsRouter)
apiRouter.use("/orders", ordersRouter)
