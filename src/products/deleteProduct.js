import {request, response} from "express"
import db from "../conn"
import path from "path"
import fs from "fs"


async function deleteProduct(req = request, res=response){
try {
    const {ids} = req.body

    const products = await db.product.findMany({
        where : {
            id : {
                in : ids
            }
        }
    })
    
    if(products.length ===0){
        return res.status(401).json({
            message : "tidak ada data product yang dipilih"
        })
    }

    products.forEach(product =>{
        const imagePath =path.resolve(__dirname, "../../uploads/products" , product.imgProduct)

        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
        }
    })



    const result = await db.product.deleteMany({
        where : {
            id : {
                in : ids
            }
        }
    })
    res.status(200).json({
        status : true,
        message : result
    })
} catch (error) {
    console.log(error)
    res.status(500).json(error)
}
}


export {
    deleteProduct
} 