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
    statics: {
      addMessage,
      getMessages,
      getLastMessages,
      getMessageById,
    },
  }
);

async function getMessages() {
  try {
    const messages = await this.find();
    return messages;
  } catch (err) {
    throw new Error("error al buscar los mensajes", { cause: err });
  }
}

async function getLastMessages() {
  try {
    const messages = await this.find().sort({timestamp: 1}).limit(20);
    return messages;
  } catch (err) {
    throw new Error("error al buscar los mensajes", { cause: err });
  }
}

async function getMessageById(mid) {
  try {
    const messages = await this.findById(mid)
    return messages;
  } catch (err) {
    throw new Error("error al buscar los mensajes", { cause: err });
  }
}



async function addMessage(msgData) {
  try {
    const creationStatus = await this.create(msgData);
    console.log(creationStatus);
    return creationStatus;
  } catch (err) {
    throw new Error("error al crear mensaje", { cause: err });
  }
}

const msgManager = mongoose.model(messageCollection, messageSchema)
export default msgManager