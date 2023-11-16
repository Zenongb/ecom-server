import { Router } from "express";
import { productsRouter } from "./products.router";


export const apiRouter = Router()

apiRouter.use("/products", productsRouter)