
export default class ProductService {
  constructor(productDao) {
    this.dao = productDao
  }
  async getProducts(query, page, sort, limit = PRODUCTS_PER_PAGE) {
    // parseamos el query para pasarselo al driver
    try {
      const paginationPipeline = []
      const searchQuery = {};
      if (query?.available) {
        searchQuery.stock = { $gt: 0 };
      }
      if (query?.category) {
        searchQuery.category = query.category;
      }
      paginationPipeline.push({$match: searchQuery})
      if (sort) {
      // hacemos lo mismo con la sort query
      const sortQuery = {};
      if (sort === "asc") {
        sortQuery.price = 1;
      } else if (sort === "desc") {
        sortQuery.price = -1;
      }
      paginationPipeline.push({$sort: sortQuery})
      }
      // agregamos skip y limit
      paginationPipeline.push(
        {
          $skip: page * limit
        },{
          $limit: limit
        }
      )
      const aggrRes = await this.aggregate([{
        // para poder conseguir el num de paginas al mismo tiempo de conseguir los
        // resultados usamos una agrregation pipeline con el stage $facet para hacer
        // multiples agregaciones en un solo stage
        $facet: {
          paginatedProducts: paginationPipeline,
          totalCount: [
            // sumamos los resultados
            {$match: searchQuery},
            {$count: 'totalCount'}
          ]
        }}])
      return aggrRes[0];
    } catch (err) {
      throw new Error("Error al buscar los productos", { cause: err });
    }
  }

  async getProductById(pid) {
    try {
      const product = this.findById(pid);
      return product;
    } catch (err) {
      throw new Error("Error al retribuir producto", { cause: err });
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock,
  }) {
    // de la validacion de los datos se encarga la db
    try {
      // Es necesario el casteo de los elementos?
      const createdStatus = await this.create({
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        category,
        stock,
      });
      return createdStatus;
    } catch (err) {
      // handle error de parametros faltantes y pasarlo al controlador
      if (err.code === "MISSINGPARAMS") {
        const errMissingParams = new Error(
          "Faltan parametros para crear Producto"
        );
        errMissingParams.code = "EBADREQ";
        throw errMissingParams;
      }
      throw new Error("Error al crear el producto", { cause: err });
    }
  }

  async updateProduct(update) {
    try {
      console.log("update is", update)
      delete update.id
      const updatedProduct = await this.findOneAndUpdate(
        { _id: update.id },
        {
          $set: {
            ...update,
          },
        },
        {
          new: true,
        }
      );
      return updatedProduct;
    } catch (err) {
      // TODO: handlear err.name=StrictModeError y demas (ENOENT, etc)
      throw new Error(`Error al actualizar Producto ${update.id}`, {
        cause: err,
      });
    }
  }

  async deleteProduct(pid) {
    try {
      const deleteResult = await this.deleteOne({ _id: pid });
      if (deleteResult.matchedCount === 0) {
        const errNoProd = new Error(`No se encontro producto con id ${id}`);
        errNoProd.code = "ENOENT";
        throw errNoProd;
      }
      console.log(deleteResult);
    } catch (err) {
      throw new Error(`Error al eliminar el Producto ${products[prodIndex].id}`, {
        cause: err,
      });
    }
  }
}
