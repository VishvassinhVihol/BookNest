const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const listingController = require('../controller/listing.js')
const multer = require('multer')
const {storage} = require('../cloudinaryConfig.js')
const { isLoggedIn } = require("../middleware.js")
const upload = multer({ storage })
const {getUserId} = require('../middleware/authUser.js')

//all listing routes
//to show all data we will create /listings GET request
//index route
router.get("/",wrapAsync(listingController.allListings))
router.post("/add-newproperty",isLoggedIn,upload.single('image'),wrapAsync(listingController.addNewListing))
router.post("/get-property",wrapAsync(listingController.getProperty))
router.post("/update-property",upload.single('image'),isLoggedIn,wrapAsync(listingController.updateProperty))
router.post("/delete-property",isLoggedIn,wrapAsync(listingController.deleteProperty))
router.post("/book-property",isLoggedIn,wrapAsync(listingController.bookProperty))
router.post("/getbooked-dates",wrapAsync(listingController.getBookedDates))
router.post('/get-long-lat',listingController.getLongLat)
module.exports = router

