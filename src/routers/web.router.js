import { Router } from "express";
import { ROLE_VALUES } from "../config.js";

import { auth } from "../middlewares/authorization.middleware.js"


export const webRouter = Router()

webRouter.get("/register", (_, res) => {
    res.render("register.handlebars", {
        title: "Registrarse",
        styles: "/static/css/auth.style.css"
    })
})

webRouter.get("/login", (_, res) => {
    res.render("login.handlebars", {
        title: "Log in",
        styles: "/static/css/auth.style.css"
    })
})

webRouter.get("/products", auth(ROLE_VALUES._AUTH_ONLY), (_, res) => {
    res.render("products.handlebars", {
        title: "Productos",
        styles: "/static/css/products.style.css"
    })
})


webRouter.get("/carts/:cid", (req, res) => {
    const cid = req.params.cid
    res.render("cart.handlebars", {
        title: "Visualizador de Carrito",
        styles: "/static/css/carts.style.css",
        cid: cid
    })
})


webRouter.get("/realtimeProducts", auth(ROLE_VALUES._ADMIN), (_, res) => {
    res.render("realtimeProducts.handlebars", {
        title: "Realtime Products",
        styles: "/static/css/realtimeProducts.style.css"
    })
})

webRouter.get("/messenger", (_, res) => {
    res.render("messenger.handlebars", {
        title: "Chat",
        styles: "/static/css/messenger.style.css"
    })
})

