import { set_id } from "../../utils/mongoose.utils.js"

export default class UserDaoMongoose {
  constructor(model) {
    this.model = model
  }

  async create(data) {
    return await this.model.create(data)
  }

  async readOne({populate, ...query}) {
    const user = await this.model.findOne(set_id(query))
    if (populate) await user.populate("cart")
    return user.toObject()
  }

  async readMany(query) {
    return await this.model.find(query).lean()
  }

  async updateOne(query, data) {
    return await this.model.findOneAndUpdate(
      set_id(query),
      { $set: data },
      { new: true }
    ).lean()
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
