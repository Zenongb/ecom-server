// Funcion de utilidad general
export const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) {
    const err = new Error("El valor es nulo")
    err.code = "EBADREQ"
    throw err
  }
  return attrib
}

export const castNum = (numStr, defaultValue = NaN) => {
    numStr = numStr === "" || numStr === " " ? NaN : Number(numStr); // check de empty string
    return Number.isNaN(numStr) ? defaultValue : numStr;
}
