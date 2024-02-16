import { ticketService } from "../services/index.service.js"

export const postController = async (req, res, next) => {
  try {
    const user = req.user
    const [ticket, cart] = await ticketService.createTicket(user)
    req.user.cart = cart
    res.status(200).json(ticket)
  } catch (err) {
    next(err)
  }
}
