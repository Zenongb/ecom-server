import { createHash } from "node:crypto"
// Funcion de utilidad general
export const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) throw new Error("El valor es nulo")
  return attrib
}

export const castNum = (numStr, defaultValue) => {
    numStr = numStr === "" || numStr === " " ? NaN : Number(numStr); // check de empty string
    return Number.isNaN(numStr) ? defaultValue : numStr;
}
