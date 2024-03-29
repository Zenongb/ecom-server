import fs from "fs/promises"
import Product from "../models/Product.js"

export default class ProductDaoFilesystem {
  constructor(path) {
    this.path = path
  }

  async getProducts() {
    let products
    try {
      products = await this.#readProds()
    } catch (err) {
      throw new Error("Error al buscar los productos", {cause: err})
    }
    return products.map(p => p.toPOJO())
  }

  async addProduct({title, description, price, thumbnail, code, status, category, stock}) {
    let products
    try {
      products = await this.#readProds()
    } catch (err) {
      throw new Error("Error al buscar los productos", {cause: err})
    }
    // check si ya existe un producto con el mismo code
    if (-1 < products.findIndex(i => i.code === code)) { // esta linea puede ser cara
      throw new Error(`ya existe un producto con el codigo ${code}`)
    }
    try {
      products.push(
        new Product({title, description, price, thumbnail, code, status, category, stock})
      )
    } catch (err) {
      // handle error de parametros faltantes y pasarlo al controlador
      if (err.code === "MISSINGPARAMS") {
        const errMissingParams = new Error("Faltan parametros para crear Producto")
        errMissingParams.code = "MISSINGPARAMS"
        throw errMissingParams
      }
      throw new Error("Error al crear el producto", {cause: err})
    }
    await this.#writeProds(products)
  }

  async getProductById(id) {
    let products
    try {
      products = await this.#readProds()
    } catch (err) {
      throw new Error("Error al buscar los productos", {cause: err})
    }
    const prod = products.find(p => p.id === id)
    if (!prod) {
      const errNoProd = new Error(`No se encontro producto con id ${id}`)
      errNoProd.code = "ENOENT"
      throw errNoProd
    }
    return prod.toPOJO()
  }

  async updateProduct(update) {
    let products
    try {
      products = await this.#readProds()
    } catch (err) {
      throw new Error("Error al buscar los productos", {cause: err})
    }
    const prodIndex = products.findIndex(p => p.id === update.id)
    if (prodIndex < 0) throw new Error(`No se encontro producto con id ${update.id}`)
    delete update.id, update.code
    // actualizar el producto creando uno nuevo convinando los datos del request
    // y el producto guardado
    try {
      products[prodIndex] = new Product({
        ...products[prodIndex].toPOJO(),
        ...update
      })
    } catch (err) {
      throw new Error(
        `Error al actualizar Producto ${products[prodIndex].id}`,
        {cause: err}
      )
    }
    await this.#writeProds(products)   
  }

  async deleteProduct(id) {
    let products
    try {
      products = await this.#readProds()
    } catch (err) {
      throw new Error("Error al buscar los productos", {cause: err})
    }
    const index = products.findIndex(p => p.id === id)
    if (index === -1) {
      const errNoProd = new Error(`No se encontro producto con id ${id}`)
      errNoProd.code = "ENOENT"
      throw errNoProd
    }
    else if (index === products.lenght - 1) products.pop()
    else if (index === 0) products.shift()
    else {
      const parteUno = products.slice(0, index)
      const parteDos = products.slice(index + 1)
      products = parteUno.concat(parteDos)
    }
    await this.#writeProds(products)
  }

  // reader & writer para la var products que utiliza el paquete fs
  async #writeProds(newProds) {
    try {
      const pojoProds = newProds.map(p => p.toPOJO())
      await fs.writeFile(this.path, JSON.stringify(pojoProds, null, 2), "utf-8")
    } catch (err) {
      throw new Error(`Error escribiendo en ${this.path}`, {cause: err})
    }
  }

  async #readProds() {
    try {
      const pojoProds = JSON.parse(await fs.readFile(this.path, "utf-8").then(p => p))
      return pojoProds.map(p => new Product({
        ...p
      }))
    } catch (err) {
      if (err.code === "ENOENT") {
        return []
      }
      throw new Error(`Error al leer ${this.path}`, {cause: err})
    }
  }
}
