import { Router } from "express";

import CartManager from "../services/CartManager.js";
import {CARTS_PATH} from "../utils/lib.js"
import {
	getByIdController,
	postController,
	putController 
} from "../controllers/carts.controller.js";


const cm = new CartManager(CARTS_PATH)

export const cartsRouter = Router()

// READ CART
cartsRouter.get("/:cid", getByIdController)

// CREATE CART
cartsRouter.post("/", postController)

// UPDATE CART
cartsRouter.put("/:cid/products/:pid", putController)