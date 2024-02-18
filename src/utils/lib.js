import { InvalidParamsError } from "../errors/errors"

// Funcion de utilidad general
export const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) {
    throw new InvalidParamsError("El valor es nulo")
  }
  return attrib
}

export const castNum = (numStr, defaultValue = NaN) => {
    numStr = numStr === "" || numStr === " " ? NaN : Number(numStr); // check de empty string
    return Number.isNaN(numStr) ? defaultValue : numStr;
}
