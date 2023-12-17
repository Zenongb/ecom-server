import { Router } from "express";


export const webRouter = Router()

webRouter.get("/products", (_, res) => {
    res.render("products.handlebars", {
        title: "Productos",
        styles: "/static/css/products.style.css"
    })
})

webRouter.get("/realtimeProducts", (_, res) => {
    res.render("realtimeProducts.handlebars", {
        title: "Realtime Products",
        styles: "/static/css/realtimeProducts.style.css"
    })
})