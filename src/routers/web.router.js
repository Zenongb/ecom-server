import { Router } from "express";


export const webRouter = Router()

webRouter.get("/", (_, res) => {
    res.render("home.handlebars", {
        title: "Productos",
        styles: "/static/css/home.style.css"
    })
})

webRouter.get("/realtimeProducts", (_, res) => {
    res.render("realtimeProducts.handlebars", {
        title: "Realtime Products",
        styles: "/static/css/realtimeProducts.style.css"
    })
})

webRouter.get("/messager", (_, res) => {
    res.render("messager.handlebars", {
        title: "Chat",
        styles: "/static/css/messager.style.css"
    })
})

