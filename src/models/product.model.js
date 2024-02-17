import { notNull } from "../utils/lib.js"
import { randomUUID } from "node:crypto"

export default class Product {
  // Clase contenedora de la informacion de los productos.

  // Variables privadas atadas a la entidad
  #id // var que no se puede modificar
  #code // var que no se puede modificar
  #price  // var que no puede ser menor a 0
  #stock

  constructor({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status=true,
    id=randomUUID(),
    _id=undefined,
  }) {
    // check de nullishness
    switch (false) {
      case !!title:
        console.log("title")
      case !!description:
        console.log("description")
      case !!price:
        console.log("price")
      case !!code:
        console.log("code")
      case !!category:
        console.log("category")
        // agregar code a error para facilitar el mansaje al cliente
        const errMissingParams = new Error("Faltan parametros para crear Producto")
        errMissingParams.code = "MISSINGPARAMS"
        throw errMissingParams
    }
    // check de id para cuando se "crean" productos leidos
    this.#id = _id !== undefined? _id : id
    this.title = notNull(title)
    this.description = description
    this.price = notNull(price)
    this.thumbnail = thumbnail
    this.#code = notNull(code)
    this.stock = notNull(stock)
    this.status = notNull(status)
    this.category = notNull(category)
  }

  set price(newPrice) {
    newPrice = Number(newPrice)
    // check si es num 
    if (isNaN(newPrice)) throw new Error("El nuevo precio no es un numero")
    if (newPrice < 0) throw new Error("El precio es menor a 0")
    this.#price = newPrice
  }

  get price() {
    return this.#price
  }

  get id() {
    return this.#id
  }

  get code() {
    return this.#code
  }

  set stock(newStock) {
    newStock = Number(newStock)
    // check si es num 
    if (isNaN(newStock)) {
      const err = new Error("El nuevo precio no es un numero")
      err.code = "EBADREQ"
      throw err
    }
    this.#stock = newStock
  }

  get stock() {
    return this.#stock
  }

  toPOJO() {
    // metodo para formatear los datos de la instancia en un objeto
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      thumbnail: this.thumbnail,
      code: this.code,
      stock: this.stock,
      status: this.status,
      category: this.category
    }
  }
}
