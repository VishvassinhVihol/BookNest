require('dotenv').config()//dotenv is an npm package used to read info from .env files


//connect mongo for session storage
const MongoStore = require('connect-mongo');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors')

//for express.router() we create new file to handle routes
const listingRouter = require("./routes/listing.js")
const userRouter = require('./routes/user.js')
const reviewRouter = require('./routes/review.js')
const dburl = process.env.ATLASDB_URL


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24*3600//aatla samay bad mari session info update thay 
})
store.on('error',(err) => {
    console.log('error in mongo session store',err);
    
})

let port = 8080;

app.listen(port,(req,res) => {
    console.log('server is running on port 8080');
    
})

//connect mongoose
async function main() {
    await mongoose.connect(dburl);
}
main()
.then(res => console.log('connecting to mongoose'))
.catch(err => console.log(err));


app.use('/api',listingRouter)
app.use('/user',userRouter)
app.use('/review',reviewRouter)