const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.addReview = async (req,res) =>{
    try {
        let {id} = req.body
        let {rating,comment} = req.body 

        if (!rating || !comment.trim()) {
            return res.json({success:false,message:'Please provide both rating and comment.'})
        }
        console.log(typeof(rating));
        
        let newReview = new Review({rating,comment})
        newReview.author = req.user.id 
        let listing = await Listing.findById(id)
        listing.reviews.push(newReview)

        await newReview.save()
        await listing.save()

        return res.json({success:true,message:'Review added!'})


    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports.getAllReviews = async(req,res) => {
    try {
        let {id} = req.body 
        let listing = await Listing.findById(id).populate({path:'reviews',populate:({path:'author'})})
        let reviews = listing.reviews
      
        return res.json({success:true,reviews})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

module.exports.deleteReview = async(req,res) => {
    try {

        let {reviewId} = req.body 
        let {id} = req.user

        let review = await Review.findById(reviewId).populate('author')


        if(id === review.author._id.toString()) {
            //now first of all we have to delete this review from reviews array of listing 
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
            //now delete review
            await Review.findByIdAndDelete(reviewId)

            return res.json({success:true,message:'Review Deleted'})
        }
        else return res.json({success:false,message:'You are not author of this review!'})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

