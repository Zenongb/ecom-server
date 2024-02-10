import {cartService} from "../services/index.service.js";
import { castNum } from "../utils/lib.js";

const cm = cartService;

export const getByIdController = async (req, res, next) => {
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
    next(err)
  }
};

export const createCartController = async (req, res, next) => {
  // TODO: agregar funcionalidad para agregar productos al carrito
  // en el momento de instanciacion del mismo
  try {
    const cart = await cm.addCart();
    return res.status(200).json({
      status: "Success",
      payload: cart,
    });
  } catch (err) {
    next(err)
  }
};

export const updateProductController = async (req, res, next) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  let amt = req.body
  amt = castNum(amt);
  try {
    if (isNaN(amt)) {
      const err = new Error("Amount recieved is not a number");
      err.code = "EBADREQ"
      throw err
    }
    const cart = await cm.updateProduct(cid, pid, amt);
    return res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (err) {
    next(err)
  }
};

export const bulkUpdateController = async (req, res) => {
  // recibo array de productos en formato [pid(String), ... , pid(String)],
  const cid = req.params.cid;
  const products = req.body;
  try {
    if (!Array.isArray(products)) {
      // shallow check de tipo
      const err = new Error("Malformed Products")
      err.code = "EBADREQ"
      throw err
    }
    const updateRes = await cm.bulkUpdateProducts(cid, products);
    console.log("in bulk update controller, updateRes:");
    console.log(updateRes);
    if (updateRes.modifiedCount === 1) {
      res.status(201).json({
        status: "success",
        payload: "bulk update successful",
      });
    }
  } catch (err) {
    next(err)
  }
};

export const removeProductController = async (req, res, next) => {
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
    next(err)
  }
};

export const removeAllProductsController = async (req, res, next) => {
  const cid = req.params.cid;
  try {
    await cm.removeAllProducts(cid);
    return res.status(200).json({
      status: "success",
      message: "Se removieron todos los productos del carrito",
    });
  } catch (err) {
    next(err)
  }
};
