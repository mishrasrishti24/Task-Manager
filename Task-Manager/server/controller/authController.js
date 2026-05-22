const userModel = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



async function registerUserController(req, res) {

    try {

        const { username, email, password,
            role

        } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide all fields"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role

        })

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}



async function loginUserController(req, res) {

    try {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        )

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}



async function getMeController(req, res) {

    try {

        const user =
            await userModel.findById(req.user.id)

        res.status(200).json({

            user: {

                id: user._id,

                username: user.username,

                email: user.email,

                role: user.role

            }

        })

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        })

    }

}

module.exports = {
    registerUserController,
    loginUserController,
    getMeController
}