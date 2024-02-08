import express from "express"
import handlebars from "express-handlebars"
// session handler import
import { sessionHandler } from "../middlewares/session.middleware.js"

import { indexRouter } from "../routers/index.router.js"
// passport handlers import
import { passportInitialize, passportSession } from "../middlewares/authentication.middleware.js"


export const app = express()

// handlebars engine
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")

// standard app middleware
app.use(express.urlencoded({extended: true}))
// le cambio el campo strict al middle de json para poder paersear los
// integers recibidos para el update de products
app.use(express.json({strict: false})) 

// aniadimos el session handler
app.use(sessionHandler)
// aniadimos los passport handlers
app.use(passportInitialize)
app.use(passportSession)



// static routes
app.use(express.static('./public'))
app.use(express.static('./views'))
app.use("/static", express.static("./static"))

// ROUTES
app.use("/", indexRouter)
