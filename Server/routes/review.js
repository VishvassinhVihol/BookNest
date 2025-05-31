const express = require('express')
const { isLoggedIn } = require('../middleware')
const router = express.Router()
const reviewController = require('../controller/review')

router.post('/create-review',isLoggedIn,reviewController.addReview)
router.post('/getall-reviews',reviewController.getAllReviews)
router.post('/delete-review',isLoggedIn,reviewController.deleteReview)


module.exports = router