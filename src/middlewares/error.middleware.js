import logger from "../utils/logger.js"
import { ERROR_CODE } from "../errors/errors.js"
export default function (error, _, res, __) {
  logger.log("error", {
    message:  `in http error handler error message is ${error.message}, code is ${error.code || "[no code]"}`,
    stack: error.stack
  })
  const errPayload = {
    httpStatus: 500,
    message: "Internal server error"
  }
  switch (error.code) {
    case ERROR_CODE._INVALID_PARAMS:
      errPayload.httpStatus = 400
      break;
    case ERROR_CODE._AUTH:
      errPayload.httpStatus = 401
      break;
    case ERROR_CODE._FORBIDDEN:
      errPayload.httpStatus = 403
      break;
    case ERROR_CODE._NO_ENTITY:
      errPayload.httpStatus = 404
      break;

  }
  if (errPayload.httpStatus !== 500) errPayload.message = error.message
  return res.status(errPayload.httpStatus).json({
    status: "Error",
    message: errPayload.message
  })
}
