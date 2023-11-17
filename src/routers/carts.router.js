import { Router } from "express";

import CartManager from "../services/CartManager.js";
import {CARTS_PATH} from "../utils/lib.js"


const cm = new CartManager(CARTS_PATH)

export const cartsRouter = Router()

// READ CART
cartsRouter.get("/:cid", async (req, res) => {
	const cid = req.params.cid
	try {
		// buscamos el carrito
		const cart = await cm.getCartById(cid)
		// y lo devolvemos
		return res.status(200).json({
			satus: "Success",
			payload: cart
		})
	} catch (err) {
		console.log(err)
		// handle not found error
		if (err.code === "ENOENT") {
			return res.status(404).json({
				status: "Failed",
				message: "Not found" 
			})
		}
		// handle error general
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error" 
		})
	}
})

// CREATE CART
cartsRouter.post("/", async (req, res) => {
	try {
		const cart = await cm.addCart({products: undefined})
    return res.status(200).json({
      status: "success",
      payload: cart.id
    })
	} catch (err) {
    console.log(err)
    return res.status(500).json({
      status: "Failed",
      meesage: "Inernal server error"
    })
	}
})


// UPDATE CART