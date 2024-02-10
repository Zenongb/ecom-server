export default class MessageService {

  constructor(messagesDao) {
    this.dao = messagesDao
  }

  async getMessages() {
    try {
      const messages = await this.dao.readMany();
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async getLastMessages() {
    try {
      const messages = await this.dao.readMany()
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async getMessageById(mid) {
    try {
      const messages = await this.dao.readOne({_id: mid})
      return messages;
    } catch (err) {
      throw new Error("error al buscar los mensajes", { cause: err });
    }
  }

  async addMessage(msgData) {
    try {
      const createdMsg = await this.dao.create(msgData);
      console.log(createdMsg);
      return createdMsg;
    } catch (err) {
      throw new Error("error al crear mensaje", { cause: err });
    }
  }
}
