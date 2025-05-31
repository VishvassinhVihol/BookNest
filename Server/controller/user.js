const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const Listing = require('../models/listing')


module.exports.signUp = async (req,res) => {
    try {

        let {name,password,email} = req.body 

        if(!name || !email || !password) return res.json({success:false,message:'all fields are required!'})
        
        if(password.length < 8) return res.json({success:false,message:'password length should at least of 8 chars'})

        //validate email
        if(!validator.isEmail(email)){
            return  res.json({success:false,message:'Enter valid email'})
        }

        //now all set first bcrypt the password and then generate the token for user and then save the user in db

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //now save user in db
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save()

        //now gen token
        const token =  jwt.sign({id:newUser._id},process.env.SECRET)
        return  res.json({success:true,token})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports.login = async(req,res) => {
    try {
        let {email,password} = req.body

        const user = await User.findOne({email:email})

        if(!user) return res.json({success:false,message:'User does not found'})

        //now verify password
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.SECRET)
            return res.json({success:true,token})
        }
        else return res.json({success:false,message:'incorrect password!'})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}


module.exports.checkOwner = async(req,res,next) => {

    try {
       
        
        let {id} = req.body
        
        let listing  = await Listing.findById(id).populate('owner')
    

        if(listing.owner._id.toString() === req.user.id) res.json({success:true,message:'you are owner'})
        else res.json({success:false,message:'you are not owner of this property!'})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
    
}