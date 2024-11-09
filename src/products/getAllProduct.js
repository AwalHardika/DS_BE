import {request, response} from "express"
import db from "../conn"

async function getAllProduct(req = request, res = response){
try {
    const result = await db.product.findMany()

    res.status(200).json(result)
} catch (error) {
    console.log(error)
    return res.status(500).json(error)
}
}


export{
    getAllProduct
}