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
  }
);

const ProductModel = mongoose.model(productCollection, productSchema);
export default ProductModel;
