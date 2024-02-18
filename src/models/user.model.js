import { InvalidParamsError } from "../errors/errors.js";

import { randomUUID } from "node:crypto";
import { ROLE_VALUES } from "../config.js";

import Cart from "./cart.model.js"

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
    role=ROLE_VALUES._USER,
    cart="", 
    age,
    login_hist,
  }) {
    try {
      this.#id = _id? _id: id
      this.#pwd = password
      this.#email = notNull(email)
      this.first_name = notNull(first_name)
      this.last_name = notNull(last_name)
      this.cart = typeof cart === "string"? cart : new Cart(cart)
      this.role = role
      this.age = age
      this.login_hist = login_hist
    } catch (err) {
      throw new InvalidParamsError("Error al crear usuario!", err)
    }
  }

  get email() {
    return this.#email
  }

  get id() {
    return this.#id
  }

  get password() {
    return this.#pwd
  }

  hasPwd() {
    return !!this.#pwd
  }

  hasCart() {
    return !!this.cart
  }

  hasCartObj() {
    return !typeof this.cart === "string"
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
      cart: typeof this.cart === "string"? this.cart : this.cart.toPOJO(),
      role: this.role,
      age: this.age,
      login_hist: this.login_hist
    }

    if (showPwd) out.password = this.#pwd
    return out
  }
}
