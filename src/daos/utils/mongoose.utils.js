
export function set_id(obj) {
  if (obj?.id !== null && obj?.id !== undefined) {
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

