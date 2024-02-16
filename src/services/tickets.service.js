import User from "../models/user.model.js"
import Product from "../models/product.model.js"
import Ticket from "../models/ticket.model.js"


export default class TicketService {
  constructor(ticketsDao, cartsDao, productsDao) {
    this.productsDao = productsDao
    this.cartsDao = cartsDao
    this.dao = ticketsDao
  }
  async createTicket(userData) {
    try {
      const user = new User(userData)
      // recibimos el carrito desde el usuario.
      // si este no tiene carrito, lanzar error
      if (!user.hasCart()) {
        const err = new Error("The user has no cart")
        err.code = "EBADREQ"
        throw err
      }
      // conseguimos el carrito populado para 
      // tener los datos de los productos
      let cart
      if (!user.hasCartObj()) {
        cart = await this.cartsDao.readOne({_id: user.cart, populate: true})
      } else {
        cart = await this.cartsDao.readOne({_id: user.cart.id, populate: true})
      }
      const ticketData = {
        purchaser: user.email,
        amount: 0
      }
      const notCompletedProducts = []
      // agregamos los costos mientras checkeamos y editamos el stock de los prods
      for (let p in cart.products) {
        if (!!!p.pid) {
          notCompletedProducts.push(p)
          continue
        }
        else if (p.pid.stock < p.quantity) {
          notCompletedProducts.push(p);
          continue
        }
        ticketData.amount += p.quantity * p.pid.price
        // actualizamos los productos
        const product = new Product({
          ...p.pid,
          stock: p.pid.stock - p.quantity
        }).toPOJO()
        const pid = product.id
        delete product.id
        await this.productsDao.updateOne(
          { _id: pid },
          product
        )
      }
      // creamos el ticket
      const ticket = new Ticket(ticketData)
      await this.dao.create(ticket.toPOJO())
      // editamos el carrito
      cart.deleteAllProducts()
      cart.updateProducts(notCompletedProducts.map(p => {
        return {pid: p.pid._id, quantity: p.quantity}
      }))
      await this.cartsDao.updateOne({_id: cart.id}, cart.toPOJO())
      return [ticket.toPOJO(), cart.toPOJO()]
    } catch (err) {
      throw err
    }
  }
}
