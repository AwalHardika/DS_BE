import {request, response} from "express"
import db from "../conn"

async function getProfile(req = request, res=response){
try {
const userId = req.userId

const findUserById = await db.user.findUnique({
    where : {
        id : userId
    }
})
res.status(200).json(findUserById)
} catch (error) {
    console.log(error)
    res.status(500).json({
        message : error
    })
}
}

export default getProfile