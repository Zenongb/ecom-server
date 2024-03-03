import winston, { format } from "winston";
import { ENV } from "../config/constants.config.js"

// generamos unas constantes que nos van a servir
const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
}

const ErrorFileTransport = new winston.transports.File({
  level: "error",
  filename: `logs/errors.log`
})

const loggerConfig = () => {
  return format.combine(
    format.timestamp(),
    format.splat(),
    format.simple(),
  )
}

let logger
if (ENV === "production") {
  logger = winston.createLogger({
    level: "info",
    levels: logLevels,
    transports: [
      ErrorFileTransport,
    ],
    format: loggerConfig()
  })
} else {
  logger = winston.createLogger({
    level: "debug",
    levels: logLevels,
    transports: [
      new winston.transports.Console(),
      ErrorFileTransport
    ],
    format: loggerConfig()
  })
}

export default logger
