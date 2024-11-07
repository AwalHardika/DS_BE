import {request, response} from "express"
import multer from "multer"
import path from "path"
import db from "../conn"



const uploadDir = path.resolve(__dirname, "../../uploads/products" )


const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, uploadDir)
    },
    filename : (req, file, cb)=>{
        const randomData = Date.now() + "-" + Math.round(Math.random() *1E9)

        cb(null, randomData + path.extname(file.originalname))

    }
})

const upload = multer({
    storage : storage
})


async function addProduct(req = request, res = response){
    try {

        const {nama, harga, deskripsi} = req.body

        const product = await db.product.create({
            data : {
                nama,
                harga,
                deskripsi,
                // ambil path gambar yang disimpan oleh multer
                imgProduct :  req.file.filename
            }
        })

        res.status(200).json(product)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message : error
        })
    }
}


export {
    addProduct,
    upload
}