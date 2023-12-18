import { Router } from "express";


export const webRouter = Router()

webRouter.get("/products", (_, res) => {
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


webRouter.get("/realtimeProducts", (_, res) => {
    res.render("realtimeProducts.handlebars", {
        title: "Realtime Products",
        styles: "/static/css/realtimeProducts.style.css"
    })
})