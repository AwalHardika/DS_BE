import {Router} from "express"
import { register } from "./register"
import { getAuthAll } from "./getAuthAll"
import { login } from "./login"
import validateUserMdl from "../middleware/validateUserMdl"
import { editAuth } from "./editAuth"


const authRoute = new Router()

authRoute.post("/api/register",register )
authRoute.get("/api/users", validateUserMdl ,getAuthAll)
authRoute.post("/api/login", login)
authRoute.put("/api/user/update", validateUserMdl, editAuth )


export default authRoute