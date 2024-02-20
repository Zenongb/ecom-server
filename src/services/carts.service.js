import logger from "../utils/logger.js"
import {
  NotFoundError,
  InvalidParamsError,
} from "../errors/errors.js"

import Cart from "../models/cart.model.js"

export default class CartService {

  constructor(cartsDao, productService) {
    this.dao = cartsDao 
    this.productService = productService
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Declaracion de las funciones de "managing" del modelo
  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  //  CREATE CART
  async addCart(products = undefined) {
    try {
      const cart = new Cart({products})
      const createdCart = await this.dao.create(cart.toPOJO());
      return createdCart;
    } catch (err) {
      throw new Error("Error al intentar aniadir el carrito", { cause: err });
    }
  }

  // ADD PROD
  async updateProduct(cid, pid, amt) {
    try {
      const pojoCart = await this.dao.readOne({ _id: cid, populate: false})
      if (pojoCart === null) {
        throw new NotFoundError(`No existe carrito con id ${cid}`)
      }
      // check si existe el producto a aniadir
      if (!await this.productService.checkProducts(pid)) {
        throw new InvalidParamsError(`No existe producto de id ${pid}`)
      }
      const cart = new Cart(pojoCart)
      cart.updateProducts({pid, quantity: amt})
      await this.dao.updateOne({_id: cid}, cart.toPOJO())
      // checkeamos los resultados del update
      return cart.toPOJO();
    } catch (err) {
      // error handling
      if (err.name === "CastError") {
        // Handle mongo error cuando el id recibido no puede ser casteado a ObjectId
        throw new InvalidParamsError(`${cid} no es Id`)
      } else if (!!err.code) {
        throw err
      }
      throw new Error("error al actualizar el carrito", { cause: err });
    }
  }

  // DELETE PROD
  async removeProducts(cid, pids) {
    try {
      const cartPojo = await this.dao.readOne({id: cid, populate: false})
      const cart = new Cart(cartPojo)
      cart.removeProducts(pids)
      return await this.dao.updateOne(
        { _id: cid},
        cart.toPOJO()
      )
    } catch (err) {
      if (!!err.code) {
        throw err;
      } else if (err.name === "CastError") {
        // Error id no castabla a ObjectId
        throw new InvalidParamsError(`${cid} no es Id`);
      }
      throw new Error("error al actualizar el carrito", { cause: err });
    }
  }

  // GET BY ID
  async getCartById(cid, populate=false) {
    try {
      const cartData = await this.dao.readOne({_id: cid, populate}) 
      const cart = new Cart(cartData)
      return cart.toPOJO();
    } catch (err) {
      if (!!err.code) {
        throw err;
      } else if (err.name === "CastError") {
        // Error id no castabla a ObjectId
        throw new InvalidParamsError(`${cid} no es Id`);
      }
      throw new Error("Error al retribuir los carritos", { cause: err });
    }
  }

  async bulkUpdateProducts(cid, pids) {
    try {
      // check si existe el producto a aniadir
      if (!await this.productService.checkProducts(pids)) {
        throw new InvalidParamsError("Algunos productos no existen")
      }
      // transformar el array de pids(String) en objects
      const parsedPids = [];
      for (let pid of pids) {
        const prodIdx = parsedPids.findIndex(p => p.pid === pid);
        if (prodIdx < 0) {
          parsedPids.push({ pid: pid, quantity: 1 });
        } else {
          parsedPids[prodIdx].quantity++;
        }
      }
      const cart = new Cart(await this.dao.readOne({id: cid, populate: false}))
      cart.updateProducts(parsedPids)
      return await this.dao.updateOne({_id: cart.id}, cart.toPOJO())
    } catch (err) {
      if (!!err.code) {
        throw err
      } else if (err.name === "CastError") {
        throw new InvalidParamsError("Array de productos malformado")
      }
      throw new Error("Error al intentar hacer bulk update", { cause: err });
    }
  }

  async removeAllProducts(cid) {
    try {
      const cartData = await this.dao.readOne({_id: cid, populate: false})
      const cart = new Cart(cartData)
      cart.deleteAllProducts()
      logger.log("debug", "in delete all",cart)
      return await this.dao.updateOne({_id: cid}, cart.toPOJO())
    } catch (err) {
      if (!!err.code) {
        throw err
      } else if (err.name === "CastError") {
        // Handle mongo error cuando el id recibido no puede ser casteado a ObjectId
        throw new InvalidParamsError(`${cid} no es Id`);
      }
      throw new Error("error al borrar todos los productos", {cause: err});
    }
  }
}
