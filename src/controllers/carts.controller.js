import CartManager from "../database/models/cart.model.js";
import { localParseInt } from "../utils/lib.js";

const cm = CartManager;

export const getByIdController = async (req, res) => {
  const cid = req.params.cid;
  try {
    // buscamos el carrito
    const cart = await cm.getCartById(cid);
    // y lo devolvemos
    return res.status(200).json({
      satus: "success",
      payload: cart,
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "error",
        message: "Not found",
      });
    } else if (err.code === "EWRONGID") {
      return res.status(400).json({
        status: "error",
        message: "Wrong Id Format",
      });
    }
    // handle error general
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const createCartController = async (req, res) => {
  // TODO: agregar funcionalidad para agregar productos al carrito
  // en el momento de instanciacion del mismo
  try {
    const cart = await cm.addCart();
    return res.status(200).json({
      status: "Success",
      payload: cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const updateProductController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  
  let amt = req.body
  amt = localParseInt(amt, NaN);
  try {
    if (isNaN(amt)) throw new Error("BADREQUEST");
    const cart = await cm.updateProduct(cid, pid, amt);
    return res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "error",
        message: "Not found",
      });
    } else if (err.code === "EWRONGID") {
      return res.status(400).json({
        status: "error",
        message: "Wrong Id Format",
      });
    } else if (err.message === "BADREQUEST") {
      return res.status(400).json({
        status: "error",
        message: "not passed int in body",
      });
    }
    // handle error general
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const bulkUpdateController = async (req, res) => {
  // recibo array de productos en formato [pid(String), ... , pid(String)],
  const cid = req.params.cid;
  const products = req.body;
  if (!Array.isArray(products))
    return res.status(400).json({
      status: "error",
      message: "malformed products",
    });
  try {
    const updateRes = await cm.bulkUpdateProducts(cid, products);
    console.log("in controller, updateRes:");
    console.log(updateRes);
    if (updateRes.modifiedCount === 1) {
      res.status(201).json({
        status: "success",
        payload: "bulk update successful",
      });
    }
  } catch (err) {
    console.log(err);
    if (err.code === "BADREQUEST")
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const removeProductController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  console.log(`Removiendo una unidad de producto ${pid} al carrito ${cid}`);
  try {
    await cm.removeProduct(cid, pid);
    return res.status(200).json({
      status: "Success",
      payload: {
        cid: cid,
        pid: pid,
      },
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "Failed",
        message: "Not found",
      });
    } else if (err.code === "EWRONGID") {
      return res.status(400).json({
        status: "Failed",
        message: "Wrong Id Format",
      });
    }
    // handle error general
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const removeAllProductsController = async (req, res) => {
  const cid = req.params.cid;
  try {
    await cm.removeAllProducts(cid);
    return res.status(200).json({
      status: "success",
      message: "Se removieron todos los productos del carrito",
    });
  } catch (err) {
    console.log(err);
    // handle not found error
    if (err.code === "ENOENT") {
      return res.status(404).json({
        status: "Failed",
        message: "Not found",
      });
    } else if (err.code === "EWRONGID") {
      return res.status(400).json({
        status: "Failed",
        message: "Wrong Id Format",
      });
    }
    // handle error general
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};
