const express = require('express')
const userRouter = express.Router()
const userController = require('../controller/user')
const { isLoggedIn } = require('../middleware')

userRouter.post('/register',userController.signUp)
userRouter.post('/login',userController.login)
userRouter.post('/check-owner',isLoggedIn,userController.checkOwner)

module.exports = userRouter