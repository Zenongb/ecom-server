import { Router } from "express"

import {
  deleteController,
  getByIdController,
  getController, 
  postController,
  putController,
} from "../controllers/products.controller.js"
import { wsUpdatedProductsPropagation } from "../middlewares/updatedProducts.middleware.js"
import { auth } from "../middlewares/authorization.middleware.js"
import { ROLE_VALUES } from "../config/constants.config.js";


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
