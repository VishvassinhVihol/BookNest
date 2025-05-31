const jwt = require('jsonwebtoken')

module.exports.getUserId = async(req,res,next) => {
    try {
        const {token} = req.headers

        if(!token) return res.json({success:false,message:'Login again permission denied!'})

        const decodeToken = jwt.verify(token,process.env.SECRET)
        req.body.id = decodeToken.id
        next()
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}