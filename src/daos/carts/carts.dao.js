
import CartModelMongoose from "./mongoose/cart.model.mongoose.js"
import CartDaoMongoose from "./mongoose/carts.dao.mongoose.js"
import CartDaoFilesystem from "./filesystem/carts.dao.filesystem.js"

import {CARTS_PATH, MODE} from "../../config/constants.config.js"


let cartsDao

if (MODE === "online") {
  cartsDao = new CartDaoMongoose(CartModelMongoose)
} else {
  cartsDao = new CartDaoFilesystem(CARTS_PATH)
}

export default cartsDao
