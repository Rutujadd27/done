const express = require("express")
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, pass } = req.body
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                res.send({ "msg": "Something went wrong", "error": err.message })
            } else {
                const user = new UserModel({ name, email, pass: hash })
                await user.save();
                res.send({ "msg": " New User has been register" })

            }
            
        });

    } catch (err) {
        res.send({ "msg": "Something went wrong", "error": err.message })
        console.log(err)
    }
})
userRouter.post("/login", async (req, res) => {
    const { email ,pass} = req.body
    try {
        const user = await UserModel.find({ email })
        console.log(user)
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                if (result) {

                    token = jwt.sign({ userID:user[0]._id}, 'masai');
                    res.send({ "msg": "Login sucessfully", "token": token })

                } else {
                    res.send("Wrong information")
                }
                
            });

        } else {
            res.send("information not found")
        }
    }
    catch (err) {

        res.send({ "msg": "Something went wrong", "error": err.message })
        console.log(err)

    }
})


module.exports = {
    userRouter
}