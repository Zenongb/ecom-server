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

