import fs from "node:fs/promises"
import Cart from "../models/Cart.js"

export default class CartManager {
  #path
  constructor(path) {
    this.#path = path
  }

  //  CREATE CART
  async addCart(products=undefined) {
    try {
      const carts = await this.#readCarts()
      // creamos el carrito y lo agregamos al array
      const newCart = new Cart({products})
      carts.push(newCart)
      // guardamos el carrito
      await this.#writeCarts(carts)
      // devolvemos el carrito para pasarle el id al cliente
      return newCart.toPOJO()
    } catch (err) {
      throw new Error("Error al intentar aniadir el carrito", {cause: err})
    }
  }

  //  READ CARTS
  async getCarts() {
    try {
      const carts = await this.#readCarts()
      return carts.map(c => c.toPOJO())
    } catch (err){
        throw new Error("Error al retribuir los carritos" , {cause: err}) 
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.#readCarts()
      // buscamos el carrito
      const cart = carts.find(c => c.id === cid)
      if (!cart) { // caso de que no exista el carrito
        throw "ENOENT"
      }
      return cart.toPOJO()
    } catch (err){
      if (err === "ENOENT") {
        const noCartErr = new Error(`No existe carrito con id ${cid}`)
        noCartErr.code = "ENOENT"
        throw noCartErr
      }
      throw new Error("Error al retribuir los carritos" , {cause: err}) 
    }
  }

  //  UPDATE CART
  async addProduct(cid, pid) {
    try {
      const carts = await this.#readCarts()
      // buscamos el carrito
      const cartIndex = carts.findIndex(c => c.id === cid)
      // handleamos el caso de que no exista el carrito
      if (cartIndex < 0) {
        const noCartErr = new Error(`No existe carrito con id ${cid}`)
        noCartErr.code = "ENOENT"
        throw noCartErr
      }
      // aniadimos el producto
      // TODO: agregar funcionalidad para interpretar si pid es un array de pids
      carts[cartIndex].addProduct(pid)
      // guardamos los carritos
      await this.#writeCarts(carts)
    } catch (err) { // error handling
      throw new Error("error al actualizar el carrito", {cause: err})
    }
  }
  //  TODO: DELETE CART

  async #writeCarts(newCarts) {
    try {
      const pojoCarts = newCarts.map(c => c.toPOJO())
      await fs.writeFile(this.#path, JSON.stringify(pojoCarts, null, 2), "utf-8")
    } catch (err) {
      throw new Error(`Error escribiendo en ${this.#path}`, {cause: err})
    }
  }

  async #readCarts() {
    try {
      const POJOCarts = await fs.readFile(this.#path, "utf-8")
      return JSON.parse(POJOCarts).map(c => new Cart({
        ...c
      }))
    } catch (err) {
      if (err.code === "ENOENT") {
        return []
      }
      throw new Error(`Error al leer carritos desde ${this.#path}`, {cause: err})
    }
  }
}
