import fs from "node:fs/promises"
import Cart from "../models/Cart"

export default class CartManager {
  #path
  constructor(path) {
    this.#path = path
  }

  // TODOS:
  //  CREATE CART
  async addCart({products}) {
    let products
    try {
      products = this.#readCarts()
    } catch (err) {
      throw new Error("Error al leer los carritos", {cause: err})
    }
  }

  //  READ CART
  //  UPDATE CART
  //  DELETE CART

  async #writeCarts(newCarts) {
    try {
      const pojoCarts = newCarts.map(c => c.toPOJO())
      await fs.writeFile(this.path, JSON.stringify(pojoCarts, null, 2), "utf-8")
    } catch (err) {
      throw new Error(`Error escribiendo en ${this.path}`, {cause: err})
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
