import { Router } from "express"
import { ROLE_VALUES } from "../config.js"
import {
  deleteController,
  getByIdController,
  getController, 
  postController,
  putController,
} from "../controllers/products.controller.js"
import { auth } from "../middlewares/authorization.middleware.js"
import { wsUpdatedProductsPropagation } from "../middlewares/updatedProducts.middleware.js"


export const productsRouter = Router()

// CREATE
productsRouter.post(
  "/",
  wsUpdatedProductsPropagation,
  auth(ROLE_VALUES._ADMIN),
  postController
)

// READ MULTI
productsRouter.get("/", getController)

// READ SINGLE
productsRouter.get("/:pid", getByIdController)

// UPDATE SINGLE
productsRouter.put(
  "/:pid",
  wsUpdatedProductsPropagation,
  auth(ROLE_VALUES._ADMIN),
  putController
)

// DELETE
productsRouter.delete(
  "/:pid",
  wsUpdatedProductsPropagation,
  auth(ROLE_VALUES._ADMIN),
  deleteController
)
