import { randomUUID } from "node:crypto";

import {comparePwd} from '../utils/hash.js'
import {notNull} from '../utils/lib.js'

export default class User {
  #id
  #email
  #pwd
  constructor({
    id= randomUUID(),
    _id,
    email,
    password,
    first_name,
    last_name,
    role,
    cart, 
    age,
    login_hist,
  }) {
    try {
      this.#id = _id? _id: id
      this.#pwd = password
      this.#email = notNull(email)
      this.first_name = notNull(first_name)
      this.last_name = notNull(last_name)
      this.cart = cart
      this.role = role
      this.age = age
      this.login_hist = login_hist
    } catch (err) {
      const outErr = new Error("Error al crear usuario!", { cause: err })
      outErr.code = !!err.code? err.code : "EBADREQ"
      throw outErr
    }
  }
  hasPwd() {
    return !!this.#pwd
  }
  async comparePwd(plainPwd) {
    return await comparePwd(plainPwd, this.#pwd)
  }

  toPOJO(showPwd=false) {
    const out = {
      id: this.#id,
      email: this.#email,
      first_name: this.first_name,
      last_name: this.last_name,
      cart: this.cart,
      role: this.role,
      age: this.age,
      login_hist: this.login_hist
    }
    if (showPwd) out.password = this.#pwd
    return out
  }
}
