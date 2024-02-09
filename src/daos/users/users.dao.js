import { MODE } from "../../config.js"
import UserDaoMongoose from "./mongoose/users.dao.mongoose.js"
import UserModel from "./mongoose/user.model.mongoose.js"

let userDao

if (MODE === "online") {
  userDao = new UserDaoMongoose(UserModel)
}

export default userDao
