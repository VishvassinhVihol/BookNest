import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ListContext } from '../Context/ListContext'
import { assests } from '../assets/assest'
import Rating from '@mui/material/Rating';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Map from '../Components/Map'


const ShowCard = () => {
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const { backendUrl, token, getAllListings } = useContext(ListContext)
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState('')
    let [comment, setComment] = useState('')
    let [rating, setRating] = useState(1)
    let [reviews, setReviews] = useState([])
    let [longLat, setLongLat] = useState({})
    const [bookedDates, setBookedDates] = useState([]);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    

    const findProperty = async () => {
        try {

            const { data } = await axios.post(`${backendUrl}/api/get-property`, { id })
            

            if (data.success) setProperty(data.property)

        } catch (error) {
            toast.error(error.message)
        }
    }
    const checkOwner = async (id) => {
        try {

            const { data } = await axios.post(backendUrl + '/user/check-owner', { id }, { headers: { token } })

            if (data.success) {
                setIsOwner(true)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateProperty = async () => {
        try {
            let formData = new FormData()
            formData.append('title', property.title)
            formData.append('description', property.description)
            formData.append('price', property.price)
            formData.append('country', property.country)
            formData.append('location', property.location)
            formData.append('id', property._id)
           

            image && formData.append('image', image)

            let { data } = await axios.post(backendUrl + '/api/update-property', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getAllListings()
                getLongLat()

            }
            else toast.error(data.message)

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteProperty = async () => {
        try {


            let { data } = await axios.post(backendUrl + '/api/delete-property', { id }, { headers: { token } })
           

            if (data.success) {
                toast.success(data.message)
                navigate('/')
            }
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addReview = async () => {
        try {


            let { data } = await axios.post(backendUrl + '/review/create-review', { rating, comment, id }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getAllReviews()
                setComment('')
                setRating(1)

            }
            else toast.error(data.message)

        } catch (error) {
            toast.error(error.message)
        }
    }

    let getAllReviews = async () => {
        try {
            let { data } = await axios.post(backendUrl + '/review/getall-reviews', { id })
            if (data.success) {
                setReviews(data.reviews)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    let deleteReview = async (id) => {
        try {
            let { data } = await axios.post(backendUrl + '/review/delete-review', { reviewId: id }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getAllReviews()
            }
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    let getLongLat = async () => {
        try {
            let { data } = await axios.post(backendUrl + '/api/get-long-lat', { location: property?.location + ',' + property?.country })
            if (data.success) {
                setLongLat(data.coordinates)
                

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    let book = async() => {
        try {
            let { startDate, endDate } = state[0]
            if (!startDate || !endDate) {
                toast.error('Please select a date range!')
                return
            }
            if (startDate > endDate) {
                toast.error('Start date cannot be after end date!')
                return
            }
            let { data } = await axios.post(backendUrl + '/api/book-property', { propertyId: id, startDate, endDate }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
               
            }
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    useEffect(() => {
        try {
            let fn = async () => {
                let {data} = await axios.post(backendUrl + '/api/getbooked-dates',{id})
                if (data.success) {
                    setBookedDates(data.bookedDates)
                }
                console.log('bookedDates in showcard', data.bookedDates);
            }   
            fn()
            
        } catch (error) {
            toast.error(error.message)
        }
    },[id])

    useEffect(() => {
        
        
        const fn = async () => {
            await findProperty()
        }
        fn()

    }, [])
    useEffect(() => {
        if (property) {
            const fn = async () => {
                await getLongLat()
                await checkOwner(id)
                await getAllReviews()
            }
            fn()
        }
    }, [property])




    return property && (
  <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Title */}
    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
      {isEdit ? (
        <input
          value={property.title}
          className="border-2 border-gray-400 rounded px-2 py-1 w-full sm:w-auto"
          onChange={(e) => setProperty(prev => ({ ...prev, title: e.target.value }))}
        />
      ) : property.title}
    </h1>

    {/* Image */}
    <div className="rounded-2xl shadow-lg overflow-hidden">
      {isEdit ? (
        <label htmlFor="image" className="block cursor-pointer">
          <div className="relative w-full aspect-video">
            <img
              className="w-full h-full object-cover rounded opacity-60"
              src={image ? URL.createObjectURL(image) : property.image.url}
              alt=""
            />
            <img
              className="absolute w-10 md:w-20 bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2"
              src={image ? '' : assests.upload_icon}
              alt=""
            />
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img
          src={property.image.url}
          alt={property.title}
          className="w-full h-auto object-cover"
        />
      )}

      {/* Property Info */}
      <div className="p-4 sm:p-6 space-y-4 text-gray-800">
        <p><span className="font-semibold">Owned by:</span> {property.owner.name}</p>
        <p><span className="font-semibold">Type:</span> {property.type}</p>
        <p><span className="font-semibold">Weather:</span> {property?.weather}</p>

        <p>
          {isEdit ? (
            <input
              value={property.description}
              className="border-2 border-gray-400 rounded px-2 py-1 w-full"
              onChange={(e) => setProperty(prev => ({ ...prev, description: e.target.value }))}
            />
          ) : (
            property.description
          )}
        </p>

        {/* Price, Location, Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><span className="font-semibold">Price:</span> ₹{isEdit ?
            <input
              value={property.price}
              className="border-2 border-gray-400 rounded px-2 py-1"
              onChange={(e) => setProperty(prev => ({ ...prev, price: e.target.value }))}
            /> : property.price}/night</p>

          <p><span className="font-semibold">Location:</span> {isEdit ?
            <input
              value={property.location}
              className="border-2 border-gray-400 rounded px-2 py-1"
              onChange={(e) => setProperty(prev => ({ ...prev, location: e.target.value }))}
            /> : property.location}</p>

          <p><span className="font-semibold">Country:</span> {isEdit ?
            <input
              value={property.country}
              className="border-2 border-gray-400 rounded px-2 py-1"
              onChange={(e) => setProperty(prev => ({ ...prev, country: e.target.value }))}
            /> : property.country}</p>
        </div>
      </div>
    </div>

    {/* Owner Actions */}
    {isOwner && (
      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        {isEdit ? (
          <button onClick={updateProperty} className="bg-green-600 px-5 py-2 rounded text-white">Save info</button>
        ) : (
          <button onClick={() => setIsEdit(true)} className="bg-black px-5 py-2 rounded text-white">Edit</button>
        )}
        <button onClick={deleteProperty} className="bg-red-700 px-5 py-2 rounded text-white">Delete</button>
      </div>
    )}

    {/* Booking Section */}
    <div className="flex flex-col justify-center mt-10 space-y-4">
      <p className="text-2xl sm:text-3xl font-medium text-center">Book Now!</p>
      <DateRange className='mx-auto'
        editableDateInputs={true}
        onChange={item => setState([item.selection])}
  
        ranges={state}
        disabledDates={bookedDates}
      />
      <button
        className="bg-blue-600 hover:bg-blue-500 cursor-pointer px-5 py-2 rounded text-white mx-auto"
        onClick={book}
      >
        Book
      </button>
    </div>

    {/* Leave Review */}
    <div className="mt-10 p-4 sm:p-6 border rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold">Leave a Review</h2>
      <div>
        <p className="mb-1 font-medium">Rating:</p>
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          precision={0.5}
          size="large"
          sx={{ fontSize: '2.5rem' }}
        />
      </div>
      <div>
        <p className="mb-1 font-medium">Comment:</p>
        <textarea
          className="w-full border px-2 py-1 rounded resize-none"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={addReview}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>

    {/* All Reviews */}
    {reviews.length > 0 && (
      <div className="mt-10">
        <hr className="border-gray-300 mb-6" />
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">All Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
              <p className="text-xl font-medium">{item.author.name}</p>
              <Rating
                readOnly
                value={item.rating}
                precision={0.5}
                size="large"
                sx={{ fontSize: '2.5rem', '& .MuiRating-icon': { margin: '0 -2px' } }}
              />
              <p className="text-gray-700 mt-2">{item.comment}</p>
              <button
                className="bg-black mt-3 px-3 py-1 rounded text-white"
                onClick={() => deleteReview(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Map */}
    <div className="mt-10 space-y-4">
      <p className="text-2xl sm:text-3xl font-medium">Where you'll be</p>
      {longLat.lat && longLat.long && <Map key={longLat.lat + longLat.long} coordinates={longLat} />}
    </div>
  </div>
)

}

export default ShowCard
