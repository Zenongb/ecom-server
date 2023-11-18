import CartManager from "../services/CartManager.js";
import { CARTS_PATH } from "../utils/lib.js";


const cm = new CartManager(CARTS_PATH)


export const getByIdController = async (req, res) => {
	const cid = req.params.cid
	try {
		// buscamos el carrito
		const cart = await cm.getCartById(cid)
		// y lo devolvemos
		return res.status(200).json({
			satus: "Success",
			payload: cart
		})
	} catch (err) {
		console.log(err)
		// handle not found error
		if (err.code === "ENOENT") {
			return res.status(404).json({
				status: "Failed",
				message: "Not found" 
			})
		}
		// handle error general
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error" 
		})
	}
}

export const postController = async (req, res) => {
  // TODO: agregar funcionalidad para agregar productos al carrito
  // en el momento de instanciacion del mismo
	try {
		const cart = await cm.addCart()
    return res.status(200).json({
      status: "Success",
      payload: {
        cid: cart.id
      }
    })
	} catch (err) {
    console.log(err)
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error"
    })
	}
}

export const putController = async (req, res) => {
  const cid = req.params.cid
  const pid = req.params.pid
  console.log(`Aniadiendo al carrito ${cid} el producto ${pid}`)
  try {
    await cm.addProduct(cid, pid)
    return res.status(200).json({
      status: "Success",
      payload: {
        cid: cid,
        pid: pid
      }
    })
  } catch (err) {
		console.log(err)
		// handle not found error
		if (err.code === "ENOENT") {
			return res.status(404).json({
				status: "Failed",
				message: "Not found" 
			})
		}
		// handle error general
		return res.status(500).json({
			status: "Failed",
			message: "Internal server error" 
		})
  }

}