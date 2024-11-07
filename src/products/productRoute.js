import {Router} from "express"
import { addProduct, upload } from "./addProduct"
import validateUserMdl from "../middleware/validateUserMdl"
import { getAllProduct } from "./getAllProduct"
import { deleteProduct } from "./deleteProduct"


const productRoute = new Router()

productRoute.get("/api/products", validateUserMdl , getAllProduct)
productRoute.delete("/api/product/delete", validateUserMdl, deleteProduct)
productRoute.post("/api/product/add", upload.single("imgProduct"), validateUserMdl, addProduct )


export default productRoute