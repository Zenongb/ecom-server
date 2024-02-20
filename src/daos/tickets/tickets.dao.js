import { MODE } from "../../config/constants.config.js"
import TicketDaoMongoose from "./mongoose/tickets.dao.mongoose.js"
import TicketModel from "./mongoose/ticket.model.mongoose.js"

let ticketsDao

if (MODE === "online") {
  ticketsDao = new TicketDaoMongoose(TicketModel)
}

export default ticketsDao
