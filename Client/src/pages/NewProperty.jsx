import axios from 'axios'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { ListContext } from '../Context/ListContext'
import { useNavigate } from 'react-router-dom'

const NewProperty = () => {
  const { backendUrl, token } = useContext(ListContext)
  let [input, setInput] = useState({
    title: '',
    description: '',
    price: '',
    country: '',
    location: '',
    type: '',
    weather: '',
  })
  let [image, setImage] = useState('')
  const navigate = useNavigate()

  const accommodationTypes = [
    'Hotel', 'Hostel', 'Beach', 'Pool', 'Guest House', 'Homestay', 'Apartment',
    'Villa', 'Cottage', 'Farmhouse', 'Tent', 'Tree House', 'Cabin', 'Bungalow',
    'Motel', 'Resort', 'Lodge', 'Chalet', 'Palace', 'Desert', 'Forest',
    'River', 'Island', 'Cave',
  ]

  const weatherTypes = ['Cold', 'Rainy', 'Hot', 'Humid', 'Snowy', 'Dry', 'Windy']

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      if (!image) {
        toast.error('Image is required!')
        return
      }

      let formData = new FormData()
      formData.append('image', image)
      Object.keys(input).forEach((key) => {
        formData.append(key, input[key])
      })

      let { data } = await axios.post(backendUrl + '/api/add-newproperty', formData, {
        headers: { token },
      })

      if (data.success) {
        toast.success(data.message)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-center w-full px-4 md:px-8 py-6">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Add New Property</h2>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
            <input
              onChange={(e) => setInput((prev) => ({ ...prev, title: e.target.value }))}
              type="text"
              required
              placeholder="Enter title"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Accommodation Type</label>
              <select
                onChange={(e) => setInput((prev) => ({ ...prev, type: e.target.value }))}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Type</option>
                {accommodationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Weather</label>
              <select
                onChange={(e) => setInput((prev) => ({ ...prev, weather: e.target.value }))}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="">Select Weather</option>
                {weatherTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
            <textarea
              rows="4"
              required
              placeholder="Enter description"
              onChange={(e) => setInput((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Upload Image</label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm file:px-3 file:py-2 file:rounded file:border-none file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Price</label>
              <input
                onChange={(e) => setInput((prev) => ({ ...prev, price: e.target.value }))}
                type="number"
                required
                placeholder="Enter price"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Country</label>
              <input
                onChange={(e) => setInput((prev) => ({ ...prev, country: e.target.value }))}
                type="text"
                required
                placeholder="Enter country"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Location</label>
            <input
              onChange={(e) => setInput((prev) => ({ ...prev, location: e.target.value }))}
              type="text"
              required
              placeholder="Enter location"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 cursor-pointer hover:bg-red-500 text-white py-2 px-4 rounded transition-colors"
          >
            Add Property
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewProperty
