import { request, response } from "express"
import bycript from "bcryptjs"
import db from "../conn";
import path from "path"
import fs from "fs"

async function register(req = request, res = response) {
    try {
        const {username, email, password, imageProfile} = req.body

        const emailCase = email.toLowerCase()
        const hashPassword = await bycript.hash(password, 10);

        const findUser = await db.user.findUnique({
            where : {
                email : emailCase
            }
        })
        // validasi user dengan email yang sama
        if(findUser){
            return res.status(400).json({
                status : false,
                message : "Email Sudah Ada"
            })
        }
        let defaultImage = "defaultProfile.png"
        // validasi type image dari image profil
        if(imageProfile){
            const mimeType = imageProfile.match(/data:(image\/\w+);base64,/)

            if(!mimeType){
                return res.status(400).json({
                    status : false,
                    message : "invalid type image"
    
                })
            }
            // mengambil ekstensi
            
            const mime = mimeType[1]; 
            // image/jpeg || image/jpg || image/png
    
            const ekstensi = mime.split('/')[1]
            // hasilnya ekstensi jpeg jpg png
    
            // menghapus prefix data url sebelum mengkonversi base64 ke buffer
            const  base64data = imageProfile.replace(/^data:image\/\w+;base64,/ , "")
    
            // mengkonversi base64 ke buffer
    
            const buffer = Buffer.from(base64data, 'base64')
            console.log(buffer)
    
            // menentukan path untuk menyimpan gambar
    
            const imagePath = path.join(__dirname, "../../uploads/profile", `${email}-profile.${ekstensi}`)
    
            const fileName = `${email}-profile.${ekstensi}`
            
            defaultImage = fileName
            // mengkonversi buffer ke file gambar
    
            fs.writeFileSync(imagePath, buffer)
        }
        
        const result = await db.user.create({
            data : {
                username,
                email : emailCase,
                password : hashPassword,
                imageProfile : defaultImage
            }
        })
        res.status(200).json(result)



    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}


export {
    register
}
