import { request, response } from "express"
import multer from "multer"
import fs from "fs"
import db from "../conn"
import path from "path"


// konfigurasi penyimpanan file gambar
const uploadDir = path.resolve(__dirname, "../../uploads/products")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const randomData = Date.now() + "-" + Math.round(Math.random() * 1E9)

        cb(null, randomData + path.extname(file.originalname))

    }
})

const upload = multer({
    storage: storage
})

async function updateProduct(req = request, res = response) {
    try {
        const { id } = req.params
        const parseId = parseInt(id)
        const { nama, harga, deskripsi } = req.body


        const product = await db.product.findUnique({
            where: {
                id: parseId
            }
        })

        // buat kontrol flow jika id product tidak ditemukan
        if (!product) {
            return res.status(401).json({
                message : "Product tidak ditemukan"
            })
        }
        // inisiasi variabel yang valuenya product.imgProduct jika si user tidak melakukan upload ulang
        let imgProductPath = product.imgProduct 

        if(req.file){
            // hapus file image lama jika user upload image

            const oldImgPath = path.resolve(__dirname, "../../uploads/products" , product.imgProduct)

            if(fs.existsSync(oldImgPath)){
                fs.unlinkSync(oldImgPath)
            }

            imgProductPath = req.file.filename

        }

        const updateResult = await db.product.update({
            where : {
                id : parseId
            },
            data : {
                nama : nama || product.nama,
                harga : harga || product.harga,
                deskripsi : deskripsi || product.deskripsi,
                imgProduct : imgProductPath
            }
        })

        res.status(200).json({
            status : true,
            message: updateResult
        })



    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


export {
    updateProduct,
    upload

}