import ProductModel from "./mongoose/product.model.mongoose.js"
import ProductDaoMongoose from "./mongoose/products.dao.mongoose.js"

import { MODE } from "../../config/constants.config.js"

let productsDao

if (MODE === "online") {
  productsDao = new ProductDaoMongoose(ProductModel)
}

export default productsDao
