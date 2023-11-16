import { randomUUID } from "node:crypto"

export default class Cart{
  #products
  #cid
  constructor({products, cid=undefined}) {
    if (!cid) {
      this.#cid = randomUUID()
    } else {
      this.#cid = cid
    }
    // check si products tiene el formato especificado
    if (!Array.isArray(products)) { // que products sea array
      throw new Error("Productos no es array")
    } 
    this.#products = products.map(p => new CartProduct(p))
  }

  // Getters y setters
  get cid() {
    return this.#cid
  }

  get products() {
    return [...this.#products]
  }

  addProduct(newPid) {
    let prodIndex = this.#products.findIndex(cp => cp.pid === newPid)
    // aniadir un producto nuevo
    if (prodIndex < 0) {
      this.#products.push(new CartProduct({pid: newPid}))
    } else { // el producto ya existe
      this.#products[prodIndex].add()
    }
  }

  toPOJO() {
    const POJOprods = this.#products.map(cp => cp.toPOJO())
    return {
      cid: this.#cid,
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
    quantity = Number(quantity)
    if (isNaN(quantity)) throw new Error("Quantity no es un numero")
    this.#quantity = quantity
  }

  // getters
  get pid() {
    return this.#pid
  }

  get quantity() {
    return this.#quantity
  }

  // funciones para sumar o restar a la cantidad de los productos
  add(amt=1) {
    this.#quantity += amt
  }
  remove(amt=1) {
    // necesita handler externo para confirmar si el numero pasa a ser negativo
    this.#quantity -= amt
  }

  toPOJO() {
    return {
      pid: this.#pid,
      quantity: this.#quantity
    }
  }
}
