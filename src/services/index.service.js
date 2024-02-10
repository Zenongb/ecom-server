import CartService from "./carts.service.js"
import cartsDao from "../daos/carts/carts.dao.js"

import ProductService from "./products.service.js"
import productsDao from "../daos/products/products.dao.js"

import UserService from "./users.service.js"
import usersDao from "../daos/users/users.dao.js"

import MessageService from "./messages.service.js"
import messagesDao from "../daos/messages/messages.dao.js"

export const cartService = new CartService(cartsDao)  
export const productService = new ProductService(productsDao)  
export const userService = new UserService(usersDao)  
export const msgService = new MessageService(messagesDao)  
