
export function set_id(obj) {
  // check si es array
  if (Array.isArray(obj)) {
    // si lo es, aplicamos set_id recursivamente
    for (idx in obj) set_id(obj[idx])
  }
  if (obj?.id !== null && obj?.id !== undefined) {
    // aca se hace el set
    obj._id = obj.id
    delete obj?.id
  }
  return obj
}

export function switchId(obj) {
  if (obj?._id !== undefined && obj?._id !== null) {
    obj.id = obj._id
    delete obj._id
  }
  if (obj?.id !== null && obj?.id !== undefined) {
    obj._id = obj.id
    delete obj.id
  }
  return obj
}

