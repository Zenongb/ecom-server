import { MODE } from "../../config/constants.config.js"
import UserDaoMongoose from "./mongoose/users.dao.mongoose.js"
import UserModel from "./mongoose/user.model.mongoose.js"

let usersDao

if (MODE === "online") {
  usersDao = new UserDaoMongoose(UserModel)
}

export default usersDao
