import { createHash } from "node:crypto"
// Funcion de utilidad general
export const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) throw new Error("El valor es nulo")
  return attrib
}

export const localParseInt = (numStr, defaultValue) => {
    numStr = numStr === "" || numStr === " " ? NaN : Number(numStr); // check de empty string
    return Number.isNaN(numStr) ? defaultValue : numStr;
}

export const hashPwd = pwd => {
  // voy a hashear la pwd para no cometer el pecado de guardar
  // secretos en plain text.

  // NOTA: Seria optimo el uso de una SALT y PEPPER para ofuscar mas el secreto
  // NOTA 2: la funcion de hashing elegida no es recomendada por la organizacion OWASP, vease:
  // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#password-hashing-algorithms
  const hash = createHash("sha512"); // este hash no es seguro!
  // le pasamos la pwd al hash
  hash.update(pwd, "utf-8")
  // devolvemos el digest del hash 
  return hash.digest("utf-8")
}
