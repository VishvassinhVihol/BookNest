//MVC:model,view,controller. MVC is design pattern used to manage code.in model we store db models.in view we store frontend and in controller we will store call back Functions
//in this listing.js we will store call back fns of listings
const { Logger } = require('mongodb');
const Listing = require('../models/listing.js')
const { cloudinary } = require('../cloudinaryConfig.js')
const Booking = require('../models/booking.js')

module.exports.allListings = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        return res.json({ success: true, allListings })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}
module.exports.addNewListing = async (req, res, next) => {
    try {
        //let {title,description,price,location,country} = req.body;//old method
        //new method
        // const listing = req.body.listing
        // const newList = new Listing(listing)
        // await newList.save()
        // // console.log(listing);
        // res.redirect('/listings')

        //handling errors
        // try{
        //     const listing = req.body.listing
        //     const newList = new Listing(listing)
        //     await newList.save()
        //     // console.log(listing);
        //     res.redirect('/listings')
        // }
        // catch(err){
        //     next(err)
        // }

        // if(!req.body.listing){
        //     throw new ExpressError(400,'send valid data for listing')//400=bad request
        // }

        //day 52 : adding image in cloudinary
        let url = req.file.path;
        let filename = req.file.filename;


        const listing = req.body
        const newList = new Listing(listing)
        // //day 51 video 6 : to add owner
        newList.owner = req.user.id
        newList.image = { url, filename }
        // newList.geometry = response.body.features[0].geometry;
        // //for flash message
        await newList.save()
        return res.json({ success: true, message: 'Property Added!' })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }


}

//to get property using id
module.exports.getProperty = async (req, res) => {
    try {

        let { id } = req.body

        if (!id) return res.json({ success: false, message: 'Property ID is required!' })


        let property = await Listing.findById(id).populate('owner')


        return res.json({ success: true, property })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

module.exports.updateProperty = async (req, res) => {
    try {

        let { id, description, price, location, title, country } = req.body
        let image = req.file


        console.log('req.body', req.body);



        if (!description || !price || !location || !title || !country) return res.json({ success: false, message: 'All fields are required!' })

        await Listing.findByIdAndUpdate(id, { title, description, price, location, country })

        if (image) {
            const imageUpload = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })
            let url = imageUpload.secure_url;
            let filename = `BookNest/${imageUpload.public_id}`;
            let Image = { url, filename }
            console.log(imageUpload);

            await Listing.findByIdAndUpdate(id, { image: Image })
        }

        return res.json({ success: true, message: "Property Updated!" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
module.exports.deleteProperty = async (req, res) => {
    try {

        let { id } = req.body
        console.log('id in ', id);

        await Listing.findByIdAndDelete(id)

        return res.json({ success: true, message: "Property Deleted!" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

module.exports.getLongLat = async (req, res) => {
    try {

        let { location } = req.body



        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.MAP_TOKEN}&limit=1`)
        let data = await response.json()

        let long = data.features[0].center[0];
        let lat = data.features[0].center[1];

        return res.json({ success: true, coordinates: { long, lat } })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

module.exports.bookProperty = async (req, res) => {
    try {
        let { propertyId, startDate, endDate } = req.body
        let userId = req.user.id

        if (!propertyId || !startDate || !endDate) return res.json({ success: false, message: 'All fields are required!' })

        //to prevent overlapping bookings
        const overlapping = await Booking.findOne({
            propertyId,
            $or: [

            ]
        })
        if (overlapping) return res.json({ success: false, message: 'This property is already booked for the selected dates!' })


        const newBooking = new Booking({ userId, propertyId, checkIn: new Date(startDate), checkOut: new Date(endDate) })
        await newBooking.save()

        return res.json({ success: true, message: "Property Booked!" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


module.exports.getBookedDates = async (req, res) => {
    try {

        //je range chhe booking mate te range ma je dates chhe te disable karva mate
        //get all bookings for a property and return the booked dates in ISO format
        //getDatesBetween function to get all dates between two dates
        function getDatesBetween(startDate, endDate) {
            const dates = [];
            let current = new Date(startDate);
            const end = new Date(endDate);

            while (current <= end) {
                dates.push(new Date(current)); // clone
                //current date ne next date ma convert karva
                current.setDate(current.getDate() + 1);
            }

            return dates;
        }

        const {id } = req.body;
       
        const bookings = await Booking.find({ propertyId:id});
      
        let allBookedDates = [];

        bookings.forEach(booking => {
            const dates = getDatesBetween(booking.checkIn, booking.checkOut);
            allBookedDates = allBookedDates.concat(dates); //be arrays ne merge karya
        });
        console.log('allBookedDates', allBookedDates);
        

        const disabledDates = allBookedDates.map(date =>
            date.toISOString().split('T')[0] //date ne YYYY-MM-DD format ma lavava
        );

        res.json({ success: true, bookedDates: disabledDates });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
