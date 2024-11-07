import express from "express"
import env from "dotenv"
import cors from "cors"
import authRoute from "./auth/authRoute"
import path from "path"
import productRoute from "./products/productRoute"


const app = express()
env.config()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json({
    limit : "100mb"
}))

app.use(express.urlencoded({
    extended : true
}))

app.use('/profile', express.static(path.join(__dirname, "../uploads/profile")))
app.use("/images/product", express.static(path.join(__dirname, "../uploads/products")))


app.get("/api/test", (req, res)=>{
res.json({
    message : "Test Berhasil"
})
})


app.use(authRoute)
app.use(productRoute)

app.listen(PORT, ()=>{
console.log(`
============================
Server Berjalan di ${PORT}
============================
`)
})