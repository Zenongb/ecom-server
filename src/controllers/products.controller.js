import ProductManager from "../dao/models/product.model.js";

const pm = ProductManager

export const getController = async (req, res) => {
  let limit = req.query.limit;
  limit = limit === "" ? NaN : Number(limit);
  console.log(`Searching for ${limit} products`);
  try {
    limit = limit === NaN ? undefined : limit;
    let products = await pm.getProducts(limit);
    return res.status(200).json(products);
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

export const connectionSocket = async socket => {
  socket.emit("updateProducts", await pm.getProducts());
};

// SERVER SOCKETS
export const serverEmitUpdateProducts = async () => {
  wsServer.emit("updateProducts", await pm.getProducts());
};
