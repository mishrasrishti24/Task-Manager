const { Router } = require("express")

const {
    registerUserController,
    loginUserController,
    getMeController
} = require("../controller/authController")

const { authUser } = require("../middleware/authMiddleware")

const authRouter = Router()



authRouter.post(
    "/register",
    registerUserController
)



authRouter.post(
    "/login",
    loginUserController
)



authRouter.get(
    "/me",
    authUser,
    getMeController
)



module.exports = authRouter