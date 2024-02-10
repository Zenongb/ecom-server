import Product from "../models/product.model.js"

import { PRODUCTS_PER_PAGE } from "../config.js"

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
      const aggrRes = await this.dao.readPaginated(
        paginationPipeline,
        searchQuery
      )
      return aggrRes
    } catch (err) {
      const outErr = new Error("Error al buscar los productos", { cause: err });
      if (err.code !== undefined || err.code !== null) outErr.code = err.code
      throw outErr
    }
  }

  async getProductById(pid) {
    try {
      const prodData = await this.dao.readOne({_id: pid})
      const product = new Product(prodData)
      return product.toPOJO();
    } catch (err) {
      const outErr = new Error("Error al retribuir producto", { cause: err });
      if (err.code !== undefined || err.code !== null) outErr.code = err.code
      throw outErr
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
      const product = new Product({
        title,
        description,
        price,
        thumbnail,
        code,
        status,
        category,
        stock,
      });
      return await this.dao.create(product.toPOJO())
    } catch (err) {
      // handle error de parametros faltantes y pasarlo al controlador
      if (err.code === "MISSINGPARAMS") {
        const errMissingParams = new Error(
          "Faltan parametros para crear Producto"
        );
        errMissingParams.code = "EBADREQ";
        throw errMissingParams;
      }
      const outErr = new Error("Error al crear el producto", { cause: err });
      if (err.code !== undefined || err.code !== null) outErr.code = err.code
      throw outErr
    }
  }

  async updateProduct(id, update) {
    try {
      const prod = new Product(await this.dao.readOne({_id: id}))
      let updProd = {
        ...prod.toPOJO(),
        ...update
      }
      updProd = new Product(updProd)
      const updatedProduct = await this.dao.updateOne(
        { _id: id },
        updProd.toPOJO(),
      );
      return updatedProduct;
    } catch (err) {
      const outErr = new Error(`Error al actualizar Producto ${update.id}`, {
        cause: err,
      });
      if (err.code !== undefined || err.code !== null) outErr.code = err.code
      throw outErr
    }
  }

  async deleteProduct(pid) {
    try {
      const deleteResult = await this.dao.deleteOne({ _id: pid });
      if (deleteResult.matchedCount === 0) {
        const errNoProd = new Error(`No se encontro producto con id ${id}`);
        errNoProd.code = "ENOENT";
        throw errNoProd;
      }
    } catch (err) {
      const outErr = new Error(`Error al eliminar el Producto ${pid}`, {
        cause: err,
      });
      if (err.code !== undefined || err.code !== null) outErr.code = err.code
      throw outErr
    }
  }
}
