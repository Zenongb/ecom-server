import mongoose from "mongoose"
import { MAIN_DB_URL } from '../config/env.config.js'
import logger from "../utils/logger.js"

export async function connectDb() {
  try {
    await mongoose.connect(MAIN_DB_URL).then(() => {
      logger.log("info", "connected to database")
    })
  } catch (err) {
    throw new Error("Error al conectarse con la main DB", { cause: err })
  }
}

export async function closeDb() {
  await mongoose.connection.close()
}
