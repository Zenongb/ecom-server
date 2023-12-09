import { Router } from "express";

import {
  getByIdController,
  postController,
  addProductController,
  removeProductController,
} from "../controllers/carts.controller.js";

export const cartsRouter = Router();

// READ CART
cartsRouter.get("/:cid", getByIdController);

// CREATE CART
cartsRouter.post("/", postController);

// UPDATE CART
// ADD PRODUCT
cartsRouter.put("/:cid/products/:pid", addProductController);
// REMOVE PRODUCT
cartsRouter.delete("/:cid/products/:pid", removeProductController);
