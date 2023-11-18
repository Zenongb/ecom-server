import { Router } from "express"
import {
  deleteController,
  getByIdController,
  getController, 
  postController,
  putController,
} from "../controllers/products.controller.js"


export const productsRouter = Router()

// CREATE
productsRouter.post("/", postController)

// READ MULTI
productsRouter.get("/", getController)

// READ SINGLE
productsRouter.get("/:pid", getByIdController)

// UPDATE SINGLE
productsRouter.put("/:pid", putController)

// DELETE
productsRouter.delete("/:pid", deleteController)
