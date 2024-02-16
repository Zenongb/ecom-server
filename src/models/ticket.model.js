import { randomUUID } from "node:crypto";
import { notNull } from "../utils/lib.js"

export default class Ticket {
  #id
  #code
  #amount
  #purchaser
  constructor({
    id = randomUUID(),
    _id,
    code = randomUUID(),
    purchase_datetime = Date.now(),
    amount,
    purchaser
  }) {
    this.#id = !!_id? _id : id
    this.#code = notNull(code)
    this.#amount = notNull(amount)
    this.#purchaser = notNull(purchaser)
    this.purchase_datetime = notNull(purchase_datetime)
  }

  toPOJO() {
    return {
      id: this.#id,
      code: this.#code,
      purchase_datetime: this.purchase_datetime,
      purchaser: this.#purchaser,
      amount: this.#amount
    }
  }
}
