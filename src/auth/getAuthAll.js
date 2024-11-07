import {request, response} from "express"
import db from "../conn"

async function getAuthAll(req= request, res= response){
    try {
        // const userId = req.userId
        // console.log(userId)
        const result = await db.user.findMany()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

export {
    getAuthAll
}