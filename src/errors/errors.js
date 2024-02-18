export const ERROR_CODE = {
  _INVALID_PARAMS: "EIPARAM",
  _NO_ENTITY: "ENOENT",
  _AUTH: "EAUTH",
  _FORBIDDEN: "EFORBIDD",
}

export class ForbiddenError extends Error {
  constructor(message, err=undefined) {
    super(message, !!err ? { cause: err } : null)
    this.code = ERROR_CODE._FORBIDDEN
  }
}

export class AuthError extends Error {
  constructor(message, err=undefined) {
    super(message, !!err ? { cause: err } : null)
    this.code = ERROR_CODE._AUTH
  }
}

export class NotFoundError extends Error {
  constructor(message, err=undefined) {
    super(message, !!err ? { cause: err } : null)
    this.code = ERROR_CODE._NO_ENTITY
  }
}

export class InvalidParamsError extends Error {
  constructor(message, err=undefined) {
    super(message, !!err ? { cause: err } : null)
    this.code = ERROR_CODE._INVALID_PARAMS
  }
}

export class TypedInvalidParamsError extends InvalidParamsError {
  constructor(description, paramTypes, obj) {
    // construimos el mensaje para pasarle al super
    let msg = description + "\n"
    for (const param in paramTypes) {
      msg += `- El campo ${param} necesita un argumento de tipo ${paramTypes[param]}, recibio: ${obj?.[param]}\n`
    }
    super(msg)
  }
}
