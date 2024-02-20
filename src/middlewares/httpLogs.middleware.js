import logger from "../utils/logger.js"

export default (req, _, next) => {
  logger.log("http", `Recieved ${req.method} to ${req.originalUrl} from ${req.ip}`)
  next()
}
