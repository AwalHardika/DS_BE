import {request, response} from "express"
import db from "../conn"
import bycrpt from "bcryptjs"
import fs from "fs"
import path from "path"



async function editAuth(req= request, res=response){
try {
    const userId = req.userId
    const {username, email, password, imageProfile} = req.body
    
    // cari user berdasarkan id
    // username, email, password, imageProfile
    const user = await db.user.findUnique({
        where : {
            id : userId
        }
    })


    if(!user){
        return res.status(401).json({
            status : false,
            message : "Anda tidak diperbolehkan edit akun ini"
        })
    }


    let emailCase = email.toLowerCase()
    // misal kamu login dengan email admin@gmail.com
    //asep@gmail.com
    if(emailCase !== user.email){
        const findUser = await db.user.findUnique({
            where : {
                email : emailCase
            }
        })
        if(findUser){
            return res.status(400).json({
                status : false,
                message : "Email already exist"
            })
        }

    }

    let passwordHash = user.password;

    if(password){
        passwordHash = await bycrpt.hash(password, 10)
    }

    let newImage = user.imageProfile
    // update image
    if(imageProfile){
         // validasi type image dari image profil
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
      
 
         // menentukan path untuk menyimpan gambar
 
         const imagePath = path.join(__dirname, "../../uploads/profile", `${email}-profile.${ekstensi}`)
 
         const fileName = `${email}-profile.${ekstensi}`

        //  hapus file lama jika ada request image baru
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
        }

        // simpan file baru
        fs.writeFileSync(imagePath, buffer)

        newImage = fileName;
    }
    
    const result = await db.user.update({
        where : {
            id : userId
        },

        data : {
            username,
            email : emailCase,
            password : passwordHash,
            imageProfile : newImage
        }
    })

   return res.status(200).json({
    status : true,
    message : result
    })





} catch (error) {
    console.log(error)
    res.status(401).json({
        status: false,
        message : error
    })
}
}


export {
    editAuth
}