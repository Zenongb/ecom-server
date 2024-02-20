import { ticketService } from "../services/index.service.js"

export const postController = async (req, res, next) => {
  try {
    const user = req.user
    const [ticket, cart] = await ticketService.createTicket(user)
    res.status(200).json({
      status: "success",
      payload: {
        ticket,
        cart,
      }
    })
  } catch (err) {
    next(err)
  }
}
