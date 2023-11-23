import { Router } from "express"
import {
  deleteController,
  getByIdController,
  getController, 
  postController,
  putController,
} from "../controllers/products.controller.js"
import { wsUpdatedProductsPropagation } from "../middlewares/updatedProducts.middleware.js"


export const productsRouter = Router()

// CREATE
productsRouter.post("/", wsUpdatedProductsPropagation, postController)

// READ MULTI
productsRouter.get("/", getController)

// READ SINGLE
productsRouter.get("/:pid", getByIdController)

// UPDATE SINGLE
productsRouter.put("/:pid", wsUpdatedProductsPropagation, putController)

// DELETE
productsRouter.delete("/:pid", wsUpdatedProductsPropagation, deleteController)
