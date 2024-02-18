import { faker } from "@faker-js/faker"
import { InvalidParamsError, TypedInvalidParamsError } from "../errors/errors.js"

import { notNull } from "../utils/lib.js"
import { randomUUID } from "node:crypto"

class ProductInvalidParamsError extends TypedInvalidParamsError {
  constructor(obj) {
    super("Error al crear producto, algunos campos estan mal.", Product.paramTypes, obj)
  }
}

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
      case !!description:
      case !!price:
      case !!code:
      case !!category:
        // agregar code a error para facilitar el mansaje al cliente
        throw new ProductInvalidParamsError({
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
          status,
        })
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
    if (isNaN(newPrice)) throw new InvalidParamsError("El nuevo precio no es un numero")
    if (newPrice < 0) throw new InvalidParamsError("El precio es menor a 0")
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
      throw InvalidParamsError("El nuevo precio no es un numero")
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
  static paramTypes = {
    "title": "string",
    "description": "string",
    "price": "number",
    "thumbnail": "string",
    "code": "string",
    "stock": "number",
    "status": "bool",
    "status": "string",
  }
  static genMockProduct() {
    return new Product({
      title: faker.word.words(2),
      description: faker.word.words(10),
      price: faker.number.int({ min: 20, max: 45000}),
      thumbnail: "",
      code: randomUUID(), // para hacerlo facil
      stock: faker.number.int({ min: 20, max: 200}),
      status: !!faker.number.int({min:0, max:1}),
      category: faker.word.noun()
    })
  }
}
