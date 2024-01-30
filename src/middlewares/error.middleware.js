export default function (error, _, res, __) {
  console.log("en error handler", error)
  const errPayload = {
    httpStatus: 500,
    message: "Internal server error"
  }
  switch (error.code) {
    case "EBADREQ" || "EWRONGID":
      errPayload.httpStatus = 400
      break;
    case "ENOAUTH":
      errPayload.httpStatus = 401
      break;
    case "EFORBIDDEN":
      errPayload.httpStatus = 403
      break;
    case "ENOENT":
      errPayload.httpStatus = 404
      break;

  }
  if (errPayload.httpStatus !== 500) errPayload.message = error.message
  return res.status(errPayload.httpStatus).json({
    status: "Error",
    message: errPayload.message
  })
}
