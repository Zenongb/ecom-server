import { castNum } from "../utils/lib.js"
import { randomUUID } from "node:crypto"

export default class Cart{
  #products
  #id
  constructor({products,_id=undefined, id=randomUUID()}) {
    this.#id = !!_id? _id : id
    // check si products tiene el formato especificado
    if (products === undefined || products === null) { // caso de que no se pase un products
      this.#products = []
    } else if (Array.isArray(products)) { // caso que products sea array
      console.log("in cart constructor, products",products)
      this.#products = products.map(p => new CartProduct(p))
    } else { // Si productos no es array
      throw new Error("Productos no tiene el formato especoficado")
    }
  }

  // Getters y setters
  get id() {
    return this.#id
  }

  get products() {
    return [...this.#products]
  }

  getProdIdx(pid) {
    return this.#products.findIndex(p => p.pid === pid )
  }

  addProducts(newPids, amt) {
    const pids = Array.isArray(newPids)? newPids : [ newPids ]
    for (const newPid of pids) {
      let prodIndex = this.getProdIdx(newPid)
      console.log("in addProducts, prodIndex", prodIndex)
      // aniadir un producto nuevo
      if (prodIndex < 0) {
        const cp = new CartProduct({pid: newPid, quantity:amt})
        this.#products.push(cp)
      } else { // el producto ya existe
        this.#products[prodIndex].quantity = quantity
      }
    }
  }

  updateProducts(prods) {
    // prods tiene el tipo [{pid: str, quantity: num}] o {pid: str, quantity: num}
    if (!Array.isArray(prods)) prods = [prods]
    for (const p of prods) {
      const pIdx = this.getProdIdx(p.pid)
      // si no existe se aniade
      if (pIdx < 0) {
        this.addProducts(p.pid, p.quantity);
        return;
      } else {
        this.#products[pIdx].quantity = p.quantity
      }
      // check si quantity es 0, en tal caso borrar el CartProduct
      if (p.quantity === 0) {
        this.deleteProduct(p.pid)
        return 
      }
    }
  } 

  removeProducts(prodsToRm) {
    // prodsToRm puede tener tres formas,
    // 1- un string que haga referencia al producto
    // 2- un array de strings que refieran a ods de prods
    // 3- un objeto que contenga los campos quantity y pid
    // 4- un arr de objs que contenga pid y quantity
    for (let prod of prodsToRm) {
      // asumo que recibo un array como el definido en el caso 4
      const pIdx = this.getProdIdx(prod.pid)
      if (pIdx < 0) continue
      this.#products[pIdx].remove(prod.quantity)
    }
  }

  deleteProduct(pids) {
    if (typeof pids === "string") {
      const pIdx = this.getProdIdx(pids)
      this.#products.splice(pIdx, 1)
      return 
    }
    for (const pid in pids) {
      const pIdx = this.getProdIdx(pid)
      this.#products.splice(pIdx, 1)
    }
  }

  deleteAllProducts() {
    this.#products = []
  }

  toPOJO() {
    return {
      id: this.#id,
      products: this.#products.map(cp => cp.toPOJO())
    }
  }
}

class CartProduct{
  #pid
  #quantity
  constructor({pid, quantity=1}) {
    console.log("in CartProduct constructor, pid is", pid)
    this.#pid = pid
    // check si quantity es num
    quantity = castNum(quantity)
    if (isNaN(quantity)) {
      const err = new Error("Quantity no es un numero")
      err.code = "EBADREQ"
      throw err
    }
    this.#quantity = quantity
  }

  // getters
  get pid() {
    return this.#pid
  }

  get quantity() {
    return this.#quantity
  }

  set quantity(newQuant) {
    this.#quantity = newQuant
  }

  toPOJO() {
    return {
      pid: this.#pid,
      quantity: this.#quantity
    }
  }
}
