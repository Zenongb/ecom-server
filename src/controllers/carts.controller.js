import CartManager from "../dao/models/cart.model.js";

const cm = CartManager;


export const getByIdController = async (req, res) => {
  const cid = req.params.cid;
  try {
    // buscamos el carrito
    const cart = await cm.getCartById(cid);
    // y lo devolvemos
    return res.status(200).json({
      satus: "Success",
      payload: cart,
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

export const postController = async (req, res) => {
  // TODO: agregar funcionalidad para agregar productos al carrito
  // en el momento de instanciacion del mismo
  try {
    const cart = await cm.addCart();
    return res.status(200).json({
      status: "Success",
      payload: {
        cid: cart._id,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

export const addProductController = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  console.log(`Aniadiendo al carrito ${cid} el producto ${pid}`);
  try {
    await cm.addProduct(cid, pid);
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
