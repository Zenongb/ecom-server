import { castNum } from "../utils/lib.js"
import { randomUUID } from "node:crypto"

export default class Cart{
  #products
  #id
  constructor({products, id=randomUUID()}) {
    this.#id = id
    // check si products tiene el formato especificado
    if (products === undefined || products === null) { // caso de que no se pase un products
      this.#products = []
    } else if (Array.isArray(products)) { // caso que products sea array
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
    return this.#products.findIndex(p=> p.pid === pid)
  }

  addProducts(newPids) {
    const pids = Array.isArray(newPids)? newPids : [ newPids ]
    for (const newPid of pids) {
      let prodIndex = this.#products.findIndex(cp => cp.pid === newPid)
      // aniadir un producto nuevo
      if (prodIndex < 0) {
        this.#products.push(new CartProduct({pid: newPid}))
      } else { // el producto ya existe
        this.#products[prodIndex].add()
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

  deleteProduct(pid) {
    const pIdx = this.getProdIdx(pid)
    if (pIdx < 0) {
      const err = new Error(`No hay producto de id: ${pid}`)
      err.code = "ENOENT"
      throw err
    } else {
      this.#products.splice(pIdx, 1)
    }
  }

  deleteAllProducts() {
    this.#products = []
  }

  toPOJO() {
    const POJOprods = this.#products.map(cp => cp.toPOJO())
    return {
      id: this.#id,
      products: POJOprods
    }
  }
}

class CartProduct{
  #pid
  #quantity
  constructor({pid, quantity=1}) {
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
