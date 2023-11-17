import { randomUUID } from "node:crypto"

export default class Cart{
  #products
  #id
  constructor({products, id=undefined}) {
    if (!id) {
      this.#id = randomUUID()
    } else {
      this.#id = id
    }
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
