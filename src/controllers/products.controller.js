import { PRODUCTS_PER_PAGE } from "../config.js";
import {productService} from "../services/index.service.js";
import { castNum } from "../utils/lib.js";

const pm = productService;

export const getController = async (req, res, next) => {
  try {
    let sort = req.query.sort;
    let limit = castNum(req.query.limit, PRODUCTS_PER_PAGE);
    let page = castNum(req.query.page, 0);
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
      return !!page ? null : "/api/products?" + queryParams;
    };
    return res.status(200).json({
      status: "Success",
      payload: paginatedProducts,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: !!prevPage ? false : true,
      hasNextPage: !!nextPage ? false : true,
      nextLink: setUri(nextPage),
      prevLink: setUri(prevPage),
    });
  } catch (err) {
    next(err)
  }
};

export const getByIdController = async (req, res, next) => {
  let pid = req.params.pid;
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
  const updates = req.body;
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

export const mockingProducts = (req, res, next) => {
  const amt = castNum(req.query.amount, 50)
  try {
    const prods = pm.genMockProducts(amt)
    return res.status(200).json({
      status: "Success", 
      payload: prods
    })
  } catch (err) {
    next(err)   
  }
}
