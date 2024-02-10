import { randomUUID } from "node:crypto"
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
  }
);

const CartModelMongoose = mongoose.model(cartCollection, cartSchema);
export default CartModelMongoose;
