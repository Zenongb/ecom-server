export default class CartService {

  constructor(messagesDao) {
    this.dao = messagesDao
  }

  async getMessages() {
    try {
      const messages = await this.find();
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async getLastMessages() {
    try {
      const messages = await this.find().sort({timestamp: 1}).limit(20);
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async getMessageById(mid) {
    try {
      const messages = await this.findById(mid)
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async addMessage(msgData) {
    try {
      const creationStatus = await this.create(msgData);
      console.log(creationStatus);
      return creationStatus;
    } catch (err) {
      throw new Error("error al crear mensaje", { cause: err });
    }
  }
}
