import MessageModelMongoose from "./mongoose/message.model.mongoose.js"
import MessageDaoMongoose from "./mongoose/messages.dao.mongoose.js"
import { MODE } from "../../config.js"

let messagesDao

if (MODE === "online") {
  messagesDao = new MessageDaoMongoose(MessageModelMongoose)
}

export default messagesDao
