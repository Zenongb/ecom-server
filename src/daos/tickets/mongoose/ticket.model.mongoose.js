import { randomUUID } from "node:crypto"
import mongoose from "mongoose";

const ticketsCollection = "tickets"
const ticketsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID(),
    },
    purchaser: {
      type: String,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: new Date()
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);


const TicketModel = mongoose.model(ticketsCollection, ticketsSchema)
export default TicketModel
