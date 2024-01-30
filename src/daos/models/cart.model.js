import { randomUUID } from "crypto";
import mongoose from "mongoose";

const cartCollection = "carts";

//////////////////////////////////////////////////////////////////////
// Definicion de schemas
//////////////////////////////////////////////////////////////////////

// Schema secundario que define la instancia del producto en
// el carrito. Fragmentado para facilidad de lectura
const productInstance = new mongoose.Schema(
  {
    pid: {
      type: String,
      ref: "products",
      immutable: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    strict: "throw",
    _id: false,
    versionKey: false,
  }
);

// Schema principal del carrito
const cartSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID,
    },
    products: {
      type: [productInstance],
      default: [],
    },
  },
  {
    // OPCIONES
    strict: "throw",
    versionKey: false,

    // METODOS ESTATICOS
    statics: {
      addCart,
      updateProduct,
      removeProduct,
      getCartById,
      bulkUpdateProducts,
      removeAllProducts,
    },
  }
);

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Declaracion de las funciones de "managing" del modelo
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//  CREATE CART
async function addCart(products = undefined) {
  try {
    const createdStatus = await this.create(products);
    return createdStatus;
  } catch (err) {
    throw new Error("Error al intentar aniadir el carrito", { cause: err });
  }
}

// ADD PROD
async function updateProduct(cid, pid, amt) {
  try {
    const cart = await this.findById(cid)
    console.log("cart is ", cart)
    if (cart === null) {
      throw new Error("ENOENT");
    }
    const pIdx = cart.products.findIndex(p => p.pid === pid)
    
    // caso de que no exista el prod count
    if (pIdx < 0) cart.products.push({pid: pid, quantity: amt})
    // caso de que exista
    else cart.products[pIdx].quantity = amt
    await cart.save()


    console.log("cart is:", cart);
    // checkeamos los resultados del update
    return cart;
  } catch (err) {
    // error handling
    if (err.message === "ENOENT") {
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

// DELETE PROD
async function removeProduct(cid, pid) {
  try {
    const updRes = await this.updateOne({ _id: cid }, { $pull: { pid: pid } });
    console.log("update result is:", updRes);
    // checkeamos los resultados del update
    if (updRes.matchedCount === 0) {
      throw new Error("ENOENT");
    }
  } catch (err) {
    // error handling
    if (err.message === "ENOENT") {
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
async function getCartById(cid) {
  try {
    const cart = await this.findById(cid, {
      _id: 1,
      "products.pid": 1,
      "products.quantity": 1,
    }).populate("products.pid");
    if (!cart) {
      // caso de que no exista el carrito
      throw new Error("ENOENT"); // un workaround para agarrar el error
    }
    return cart;
  } catch (err) {
    if (err.message === "ENOENT") {
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

async function bulkUpdateProducts(cid, pids) {
  // KNOWN BUG: si el carrito ya tiene productos y se repiete alguna de las pids
  // la operacion va a generar una nueva instancia del producto en el carrito.
  // Tambien esta operacion no es idempotente, ya que no tengo forma de checkear
  // la unicidad de la operacion
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
    const updateRes = await this.updateOne(
      { _id: cid },
      { $push: { products: { $each: parsedPids } } }
    );
    console.log("in manager");
    console.log(updateRes);
    return updateRes;
  } catch (err) {
    if (err.name === "CastError") {
      const errBadReq = new Error("Array de productos malformado");
      errBadReq.code = "EBADREQ";
      throw errBadReq;
    }
    throw new Error("Error al intentar hacer bulk update", { cause: err });
  }
}

async function removeAllProducts(cid) {
  try {
    const updRes = await this.updateOne(
      { _id: cid },
      {
        $set: { products: [] },
      }
    );
    console.log(updRes);
    if (updRes.matchedCount === 0) {
      throw new Error("ENOENT");
    }
  } catch (err) {
    // error handling
    if (err.message === "ENOENT") {
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
    throw new Error("error al borrar todos los productos");
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// instanciacion y exportacion del modelo
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const cartManager = mongoose.model(cartCollection, cartSchema);
export default cartManager;
