import { Router } from "express";

import {
  getByIdController,
  createCartController,
  updateProductController,
  removeProductController,
  bulkUpdateController,
  removeAllProductsController,
} from "../controllers/carts.controller.js";

export const cartsRouter = Router();

// READ CART
cartsRouter.get("/:cid", getByIdController);

// CREATE CART
cartsRouter.post("/", createCartController);

// UPDATE CART
// UPDATE PRODUCT
cartsRouter.put("/:cid/products/:pid", updateProductController);
// ADD MULTIPLE PRODUCTS
cartsRouter.put("/:cid", bulkUpdateController)
// REMOVE PRODUCT
cartsRouter.delete("/:cid/products/:pid", removeProductController);
// REMOVE ALL PRODUCTS
cartsRouter.delete("/:cid/products", removeAllProductsController);
