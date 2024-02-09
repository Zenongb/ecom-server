
export default class ProductDaoMongoose {

  constructor(model) {
    this.model = model
  }

  async create(data) {
    return await this.model.create(data)
  }

  async readOne(query) {
    return await this.model.findOne(this.#parseId(query)).lean()
  }

  async readMany(query) {
    return await this.model.find(query).lean()
  }

  async updateOne(query, data) {
    return await this.model.findOneAndUpdate(
      this.#parseId(query),
      { $set: data },
      { new: true })
  }

  async updateMany(query, data) {
    return await this.model.updateMany(
      this.#parseId(query),
      { $set: data }
    )
  }

  async deleteOne(query) {
    throw new Error("Not implemented!")
  }

  async deleteMany(query) {
    throw new Error("Not implemented!")
  }

  #parseId(query) {
    const id = query?.id
    if (id !== null || id !== undefined) {
      query._id = id
      delete query.id
    }
    return query
  }
}
