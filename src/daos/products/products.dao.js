import ProductModel from "./mongoose/product.model.mongoose.js"
import ProductDaoMongoose from "./mongoose/products.dao.mongoose.js"

let productsDao

if (MODE === "online") {
  productsDao = new ProductDaoMongoose(ProductModel)
}

export default productsDao
