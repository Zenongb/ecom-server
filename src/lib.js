// variable del path de productos
export const PRODUCTS_PATH = "./data/products.json" // cambiar a path absoluto

// Funcion de utilidad general
export const notNull = (attrib) => {
  if (attrib === null || attrib === undefined) throw new Error("El valor es nulo")
  return attrib
}

