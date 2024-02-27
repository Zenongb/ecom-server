import logger from "../utils/logger.js"

export const loggerTest = (req, res, next) => {
  const logLevels = [
    "fatal",
    "error",
    "warning",
    "info",
    "http",
    "debug"
  ]
  for (let ll of logLevels) {
    logger.log(ll, `Testeando un log de nivel ${ll}!`)
  }
  res.status(200).json({
    payload: "succesfull logging",
    status: "success"
  })
}
