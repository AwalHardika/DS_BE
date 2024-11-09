import { request, response } from "express"
import jwt from "jsonwebtoken"

async function validateUserMdl(req=request, res=response, next) {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader){
            res.status(401).json({
                status : false,
                message : "UnAuthorized"
            })
        }
        const token = authHeader.split(" ")[1]
        if(!token){
            res.status(401).json({
                status : false,
                message : "Invalid Token"
            })
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decodedToken.userId
        next()
    } catch (error) {
       console.log(error)
       return res.status(403).json(error.name)
    }
}


export default validateUserMdl