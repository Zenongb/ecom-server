
import CartModelMongoose from "./mongoose/cart.model.mongoose.js"
import CartDaoMongoose from "./mongoose/cart.dao.mongoose.js"
import CartModelFilesystem from "./filesystem/cart.model.filesystem.js"
import CartDaoFilesystem from "./filesystem/cart.dao.filesystem.js"



let cartsDao

if (MODE === "online") {
  cartsDao = new CartDaoMongoose(CartModelMongoose)
} else {
  cartsDao = new CartDaoFilesystem()
}

export default cartsDao
