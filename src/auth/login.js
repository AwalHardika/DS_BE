import {request, response} from "express"
import jwt from "jsonwebtoken"
import db from "../conn"
import bcrypt from "bcryptjs"

async function login(req= request, res = response){
try {
    const {email, password} = req.body

    const emailCase = email.toLowerCase()
    const findUser = await db.user.findUnique({
        where : {
            email : emailCase
        }
    })

    if(!findUser) {
        return res.status(401).json({
            status : false,
            message : "Email yang anda masukan salah"
        })
    }

    const truePass = bcrypt.compare(password, findUser.password)

    if(!truePass){
        res.status(400).json({
            status : false,
            message : "Password yang anda masukan salah"
        })
    }
    const jwt_key = process.env.JWT_SECRET_KEY
    const token = await jwt.sign({userId : findUser.id}, jwt_key, {
       expiresIn : "1d" 
    })

    res.status(200).json(token)

} catch (error) {
    console.log(error)
}
}

export {
    login
}