import {randomUUID} from "crypto";
import mongoose from "mongoose";

const productCollection = "products";

//////////////////////////////////////////////////////////////////////
// Definicion de schemas
//////////////////////////////////////////////////////////////////////

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      required: true,
      unique: true, // tiene que ser unico
      immutable: true, // no se puede cambiar
    },
    stock: {
      type: Number, // Cuidado, puede ser float
      required: true,
      min: 0,
    },
    category: {
      type: String,
      requred: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  // Opciones
  {
    strict: "throw",
    versionKey: false,
    statics: {
      getProducts,
      getProductById,
      addProduct,
      updateProduct,
      deleteProduct,
    },
  }
);

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Declaracion de las funciones de "managing" del modelo
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

async function getProducts(limit = undefined) {
  try {
    const products = await this.find({}, null, { limit: limit });
    return products;
  } catch (err) {
    throw new Error("Error al buscar los productos", { cause: err });
  }
}

async function getProductById(pid) {
  try {
    const product = this.findById(pid);
    return product;
  } catch (err) {
    throw new Error("Error al retribuir producto", { cause: err });
  }
}

async function addProduct({
  title,
  description,
  price,
  thumbnail,
  code,
  status,
  category,
  stock,
}) {
  // de la validacion de los datos se encarga la db
  try {
    // Es necesario el casteo de los elementos?
    const createdStatus = await this.create({
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock,
    });
    return createdStatus;
  } catch (err) {
    // handle error de parametros faltantes y pasarlo al controlador
    if (err.code === "MISSINGPARAMS") {
      const errMissingParams = new Error(
        "Faltan parametros para crear Producto"
      );
      errMissingParams.code = "MISSINGPARAMS";
      throw errMissingParams;
    }
    throw new Error("Error al crear el producto", { cause: err });
  }
}

async function updateProduct(pid, update) {
  try {
    console.log("update is", update)
    delete update.id
    const updatedProduct = await this.findOneAndUpdate(
      { _id: pid },
      {
        $set: {
          ...update,
        },
      },
      {
        new: true,
      }
    );
    return updatedProduct;
  } catch (err) {
    throw new Error("Error al actualizar Producto", {
      cause: err,
    });
  }
}

async function deleteProduct(pid) {
  try {
    const deleteResult = await this.deleteOne({ _id: pid });
    if (deleteResult.matchedCount === 0) {
      const errNoProd = new Error(`No se encontro producto con id ${id}`);
      errNoProd.code = "ENOENT";
      throw errNoProd;
    }
    console.log(deleteResult);
  } catch (err) {
    throw new Error(`Error al eliminar el Producto ${products[prodIndex].id}`, {
      cause: err,
    });
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// instanciacion y exportacion del modelo
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const productManager = mongoose.model(productCollection, productSchema);
export default productManager;
