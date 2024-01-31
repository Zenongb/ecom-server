import mongoose from "mongoose"
import { MAIN_DB_URL } from '../config.js'

export default async function() {
  try {
    await mongoose.connect(MAIN_DB_URL).then(() => {
      console.log("connected to database")
    })
  } catch (err) {
    throw new Error("Error al conectarse con la main DB", { cause: err })
  }
}


