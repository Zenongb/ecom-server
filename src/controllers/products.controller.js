import { PRODUCTS_PER_PAGE } from "../config.js";
import {productService} from "../services/index.service.js";

const pm = productService;

export const getController = async (req, res, next) => {
  try {
    let limit = req.query.limit;
    // Parseamos limit
    limit = limit === "" || limit === " " ? NaN : Number(limit); // check de empty string
    limit = Number.isNaN(limit) ? PRODUCTS_PER_PAGE : limit;
    let sort = req.query.sort;
    // Parseamos page
    let page = req.query.page;
    page = page === "" || page === " " ? NaN : Number(page); // check de empty string
    page = Number.isNaN(page) ? 0 : page;
    // Parseamos query
    const query = req.query.query;
    const searchQuery = {};
    if (query) {
      const queryArr = query.split("-");
      for (let kv of queryArr) {
        if (kv === "") continue; // evitamos el caso en que no exista una query
        const [key, value] = kv.split(":");
        if (value !== undefined) searchQuery[key] = value;
      }
    }
    // Parseamos available
    if (searchQuery.available) {
      searchQuery.available = searchQuery.available === "true"? true : false;
    }
    const { paginatedProducts, totalCount } = await pm.getProducts(
      searchQuery,
      page,
      sort,
      limit
    );
    console.log("in getProducts", paginatedProducts)
    // calculamos las pages
    const totalPages = Math.ceil(totalCount[0].totalCount / limit);
    const prevPage = page - 1 >= 0 ? page - 1 : null;
    const nextPage = page + 1 < totalPages ? page + 1 : null;
    const setUri = page => {
      // funcion de utilidad para resolver la logica de sumar page a querys
      const queryParams = new URLSearchParams({
        limit: limit,
        query: query,
        sort: sort,
        page: page,
      });
      return page === null ? null : "/api/products?" + queryParams;
    };
    return res.status(200).json({
      status: "Success",
      payload: paginatedProducts,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: prevPage === null ? false : true,
      hasNextPage: nextPage === null ? false : true,
      nextLink: setUri(nextPage),
      prevLink: setUri(prevPage),
    });
  } catch (err) {
    next(err)
  }
};

export const getByIdController = async (req, res, next) => {
  let pid = req.params.pid;
  console.log(`Searching for ${pid}`);
  try {
    const product = await pm.getProductById(pid);
    res.status(200).json({
      status: "Success",
      payload: product,
    });
  } catch (err) {
    next(err)
  }
};

// UPDATE
export const postController = async (req, res, next) => {
  const np = req.body;
  console.log("Creating new product");
  console.log(np);
  try {
    const createResult = await pm.addProduct(np);
    return res.status(200).json({
      status: "Success",
      payload: createResult,
    });
  } catch (err) {
    next(err)
  }
};

export const putController = async (req, res, next) => {
  const pid = req.params.pid;
  console.log(`Updating ${pid}`);
  const updates = req.body;
  console.log(`Updates are ${updates}`);
  try {
    await pm.updateProduct(pid, {
      ...updates,
    });
    res.status(200).json({
      status: "Success",
      message: "Producto actualizado exitosamente",
    });
  } catch (err) {
    next(err)
  }
};

// DELETE
export const deleteController = async (req, res, next) => {
  const pid = req.params.pid;
  console.log(`Deleting ${pid}`);
  try {
    await pm.deleteProduct(pid);
    res.status(200).json({
      status: "Success",
      message: "Producto eliminado exitosmente",
    });
  } catch (err) {
    next(err)
  }
};
