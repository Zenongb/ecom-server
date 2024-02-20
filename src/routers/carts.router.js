import { Router } from "express";
import { ROLE_VALUES } from "../config/constants.config.js";

import {
  getByIdController,
  createCartController,
  updateProductController,
  removeProductController,
  bulkUpdateController,
  removeAllProductsController,
} from "../controllers/carts.controller.js";
import { auth } from "../middlewares/authorization.middleware.js";

export const cartsRouter = Router();

// READ CART
cartsRouter.get("/:cid", getByIdController);

// CREATE CART
cartsRouter.post("/", createCartController);

// UPDATE CART
// UPDATE PRODUCT
cartsRouter.put(
  "/:cid/products/:pid",
  auth(ROLE_VALUES._USER),
  updateProductController
);
// ADD MULTIPLE PRODUCTS
cartsRouter.put(
  "/:cid",
  auth(ROLE_VALUES._USER),
  bulkUpdateController
)
// REMOVE PRODUCT
cartsRouter.delete(
  "/:cid/products/:pid",
  auth(ROLE_VALUES._USER),
  removeProductController
);
// REMOVE ALL PRODUCTS
cartsRouter.delete(
  "/:cid/products",
  auth(ROLE_VALUES._USER),
  removeAllProductsController
);
