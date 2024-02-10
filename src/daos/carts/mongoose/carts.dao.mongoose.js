import { set_id, switchId } from "../../utils/mongoose.utils.js"

export default class CartsDaoMongoose {

  constructor(model) {
    this.model = model
  }

  async create(data) {
    return await this.model.create(data)
  }

  async readOne(query) {
    const populated = query.populated
    delete query.populated
    if (populated === undefined) populated = true
    const cart = await this.model.findOne(set_id(query)).lean()
    if (populated) await cart.populate("products.pid")
    return switchId(cart)
  }

  async readMany(query) {
    return await this.model.find(query).lean()
  }

  async updateOne(query, data) {
    delete data.id
    return await this.model.findOneAndUpdate(
      set_id(query),
      { $set: data },
      { new: true })
  }

  async updateMany(query, data) {
    return await this.model.updateMany(
      set_id(query),
      { $set: data }
    )
  }

  async deleteOne(query) {
    throw new Error("Not implemented!")
  }

  async deleteMany(query) {
    throw new Error("Not implemented!")
  }
  
}
