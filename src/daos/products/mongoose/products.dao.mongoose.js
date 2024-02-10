import { set_id } from "../../utils/mongoose.utils.js"

export default class ProductDaoMongoose {

  constructor(model) {
    this.model = model
  }

  async create(data) {
    return await this.model.create(data)
  }

  async readOne(query) {
    return await this.model.findOne(set_id(query)).lean()
  }

  async readMany(query) {
    return await this.model.find(query).lean()
  }
  async readPaginated(paginationPipeline, query) {
    const res = await this.model.aggregate([{
      // para poder conseguir el num de paginas al mismo tiempo de conseguir los
      // resultados usamos una agrregation pipeline con el stage $facet para hacer
      // multiples agregaciones en un solo stage
      $facet: {
        paginatedProducts: paginationPipeline,
        totalCount: [
          // sumamos los resultados
          {$match: query},
          {$count: 'totalCount'}
        ]
      }}])
    return res[0]
  }

  async updateOne(query, data) {
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
