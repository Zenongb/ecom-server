import {randomUUID} from "crypto"
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
      default: randomUUID
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
      addProduct,
      removeProduct,
      getCartById,
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
async function addProduct(cid, pid) {
  try {
    // quiero poder enviar un solo pedido a la db y que esta se ocupe de la logica de
    // crear una entrada del objeto o actualizar un objeto.
    const updateResult = await this.bulkWrite([
      {
        updateOne: {
          // caso en el que exista el producto en el array
          filter: { _id: cid, "products.pid": pid },
          update: {
            // TODO: cambiar a una operacion idempotente
            $inc: { "products.$.quantity": 1 },
          },
        },
      },
      {
        updateOne: {
          // caso en el que no existe el objeto que contiene el pid
          filter: { _id: cid, "products.pid": { $ne: pid } },
          update: {
            $push: {
              products: { pid: pid, quantity: 1 },
            },
          },
        },
      },
    ]);
    console.log("update result is:", updateResult);
    // checkeamos los resultados del update
    if (updateResult.matchedCount === 0) {
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

// DELETE PROD
async function removeProduct(cid, pid) {
  try {
    // quiero poder enviar un solo pedido a la db y que esta se ocupe de la logica de
    // crear una entrada del objeto o actualizar un objeto.
    const updRes = await this.bulkWrite([
      {
        updateOne: {
          // caso en el que el producto tenga un elemento (delete)
          filter: {
            _id: cid,
            // usamos elemMatch para asegurar de que amobos campos existan
            products: { $elemMatch: { pid: pid, quantity: 1 } },
          },
          update: {
            $pull: { products: { pid: pid } },
          },
        },
      },
      {
        updateOne: {
          // caso de que el elemento tenga mas de una unidad del producto
          filter: { _id: cid, "products.pid": pid },
          update: {
            // TODO: cambiar a una operacion idempotente
            $inc: { "products.$.quantity": -1 },
          },
        },
      },
    ]);
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

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// instanciacion y exportacion del modelo
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
const cartManager = mongoose.model(cartCollection, cartSchema);
export default cartManager;
