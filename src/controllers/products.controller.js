import { PRODUCTS_PER_PAGE } from "../config.js";
import ProductManager from "../database/models/product.model.js";

const pm = ProductManager;

export const getController = async (req, res) => {
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
    const [{ paginatedProducts, totalCount }] = await pm.getProducts(
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
    console.log(err);
    res.status(500).send("Error al buscar los productos");
  }
};

export const getByIdController = async (req, res) => {
  let pid = req.params.pid;
  console.log(`Searching for ${pid}`);
  try {
    const product = await pm.getProductById(pid);
    res.status(200).json({
      status: "Success",
      payload: product,
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "Failed",
        message: "Not Found",
      });
    }
    // generic error response
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

// UPDATE
export const postController = async (req, res) => {
  const np = req.body;
  console.log(`Creating new product with following data ${np}`);
  console.log(np);
  try {
    const createResult = await pm.addProduct(np);
    return res.status(200).json({
      status: "Success",
      payload: np,
    });
  } catch (err) {
    console.log(err);
    if (err.code === "MISSINGPARAMS") {
      return res.status(400).json({
        status: "Failed",
        message: "Missing parameters",
      });
    }
    res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const putController = async (req, res) => {
  const pid = req.params.pid;
  console.log(`Updating ${pid}`);
  const updates = req.body;
  console.log(`Updates are ${updates}`);
  try {
    await pm.updateProduct({
      ...updates,
      id: pid,
    });
    res.status(200).json({
      status: "Success",
      message: "Producto actualizado exitosamente",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

// DELETE
export const deleteController = async (req, res) => {
  const pid = req.params.pid;
  console.log(`Deleting ${pid}`);
  try {
    await pm.deleteProduct(pid);
    res.status(200).json({
      status: "Success",
      message: "Producto eliminado exitosmente",
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "Failed",
        message: "Not Found",
      });
    }
    // generic error response
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

// WEBSOCKETS CONTROLLERS
// Estos van aca? pensé en hacer una carpeta separada llamada sockets,
// pero realmente no se como estructurarlo

import { wsServer } from "../app.js";
import { PRODUCTS_PATH } from "../config.js";

export const connectionSocket = async socket => {
  socket.emit("updateProducts", await pm.getProducts());
};

// SERVER SOCKETS
export const serverEmitUpdateProducts = async () => {
  wsServer.emit("updateProducts", await pm.getProducts());
};
