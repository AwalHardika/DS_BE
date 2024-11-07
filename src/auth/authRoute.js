import {Router} from "express"
import { register } from "./register"
import { getAuthAll } from "./getAuthAll"
import { login } from "./login"
import validateUserMdl from "../middleware/validateUserMdl"


const authRoute = new Router()

authRoute.post("/api/register",register )
authRoute.get("/api/users", validateUserMdl ,getAuthAll)
authRoute.post("/api/login", login)


export default authRoute