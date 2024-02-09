import { randomUUID } from "node:crypto";

import {hashPwd} from '../utils/hash.js'
import {notNull} from '../utils/lib.js'

export class User {
  #id
  #email
  #pwd
  constructor({
    id= randomUUID(),
    email,
    pwd,
    first_name,
    last_name,
    cart, 
    age,
    login_hist,
  }) {
    try {
      this.#id = notNull(id)
      this.#pwd = await hashPwd(notNull(pwd)) 
      this.#email = notNull(email)
      this.first_name = notNull(first_name)
      this.last_name = notNull(last_name)
      this.cart = cart
      this.age = age
      this.login_hist = login_hist
    } catch (err) {
      
      throw new Error("Error al crear usuario!", { cause: err })
    }
  }
}
