import Cart from "../models/cart.model.js"

export default class CartService {

  constructor(cartsDao) {
    this.dao = cartsDao 
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
      const pojoCart = await this.dao.readOne({ _id: cid, populated: false})
      if (pojoCart === null) {
        throw new Error("ENOENT");
      }
      const cart = new Cart(pojoCart)
      cart.updateProducts({pid, quantity: amt})
      await this.dao.updateOne({_id: cid}, cart.toPOJO())
      // checkeamos los resultados del update
      return cart.toPOJO();
    } catch (err) {
      // error handling
      if (err.message === "ENOENT") {
        // handle ENOENT, tiramos el error apropiadamente
        const noCartErr = new Error(`No existe carrito con id ${cid}`);
        noCartErr.code = "ENOENT";
        throw noCartErr;
      } else if (err.name === "CastError") {
        // Handle mongo error cuando el id recibido no puede ser casteado a ObjectId
        const wrongIdErr = new Error(`${cid} no es Id`);
        wrongIdErr.code = "EWRONGID";
        throw wrongIdErr;
      }
      throw new Error("error al actualizar el carrito", { cause: err });
    }
  }

  // DELETE PROD
  async removeProducts(cid, pids) {
    try {
      const cartPojo = await this.dao.readOne({id: cid, populated: false})
      const cart = new Cart(cartPojo)
      cart.removeProducts(pids)
      return await this.dao.updateOne(
        { _id: cid},
        cart.toPOJO()
      )
    } catch (err) {
      // error handling
      if (err.code === "ENOENT") {
        // handle ENOENT
        // tiramos el error apropiadamente
        const noCartErr = new Error(`No existe carrito con id ${cid}`);
        noCartErr.code = "ENOENT";
        throw noCartErr;
      } else if (err.name === "CastError") {
        // Handle mongo error cuando el id recibido no puede ser casteado a ObjectId
        const wrongIdErr = new Error(`${cid} no es Id`);
        wrongIdErr.code = "EWRONGID";
        throw wrongIdErr;
      }
      throw new Error("error al actualizar el carrito", { cause: err });
    }
  }

  // GET BY ID
  async getCartById(cid) {
    try {
      const cartData = await this.dao.readOne({_id: cid}) 
      console.log("en cartById service, cartDat is", cartData)
      const cart = new Cart(cartData)
      return cart.toPOJO();
    } catch (err) {
      if (err.code === "ENOENT") {
        // handle ENOENT
        // tiramos el error apropiadamente
        const noCartErr = new Error(`No existe carrito con id ${cid}`);
        noCartErr.code = "ENOENT";
        throw noCartErr;
      } else if (err.name === "CastError") {
        // Error id no castabla a ObjectId
        const wrongIdErr = new Error(`${cid} no es Id`);
        wrongIdErr.code = "EWRONGID";
        throw wrongIdErr;
      }
      throw new Error("Error al retribuir los carritos", { cause: err });
    }
  }

  async bulkUpdateProducts(cid, pids) {
    try {
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
      const cart = new Cart(await this.dao.readOne({id: cid, populated: false}))
      cart.updateProducts(parsedPids)
      return await this.dao.updateOne({_id: cart.id}, cart.toPOJO())
    } catch (err) {
      if (err.name === "CastError") {
        const errBadReq = new Error("Array de productos malformado");
        errBadReq.code = "EBADREQ";
        throw errBadReq;
      }
      throw new Error("Error al intentar hacer bulk update", { cause: err });
    }
  }

  async removeAllProducts(cid) {
    try {
      const cartData = await this.dao.readOne({_id: cid, populated: false})
      const cart = new Cart(cartData)
      cart.deleteAllProducts()
      console.log("in delete all",cart)
      return await this.dao.updateOne({_id: cid}, cart.toPOJO())
    } catch (err) {
      // error handling
      if (err.code === "ENOENT") {
        // handle ENOENT
        // tiramos el error apropiadamente
        const noCartErr = new Error(`No existe carrito con id ${cid}`);
        noCartErr.code = "ENOENT";
        throw noCartErr;
      } else if (err.name === "CastError") {
        // Handle mongo error cuando el id recibido no puede ser casteado a ObjectId
        const wrongIdErr = new Error(`${cid} no es Id`);
        wrongIdErr.code = "EWRONGID";
        throw wrongIdErr;
      }
      throw new Error("error al borrar todos los productos", {cause: err});
    }
  }
}
