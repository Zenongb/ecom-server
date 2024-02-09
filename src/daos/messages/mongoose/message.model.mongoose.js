import { randomUUID } from "crypto";
import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: randomUUID,
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);


const MessageModel = mongoose.model(messageCollection, messageSchema)
export default MessageModel
