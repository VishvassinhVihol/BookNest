import React, { useContext, useEffect, useState } from 'react'
import { ListContext } from '../Context/ListContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFortAwesomeAlt } from '@fortawesome/free-brands-svg-icons' // ✅ Correct
import { toast } from 'react-toastify'


import {
    faPersonSwimming,
    faCow,
    faMountain,
    faTree,
    faHotel,
    faTent,
    faWater,
    faSnowflake,
    faUmbrellaBeach,
    faCloudRain
} from '@fortawesome/free-solid-svg-icons'


const Home = () => {
    const { listings, getAllListings, setListings } = useContext(ListContext)
    const navigate = useNavigate()
    let [allListings, setAllListings] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    useEffect(() => {
        getAllListings()
    }, [])

    useEffect(() => {
        if (listings.length > 0 && allListings.length === 0) {
            setAllListings(listings);
        }
    }, [listings]);

    const handleClick = async (category) => {
        try {

            if (category === selectedCategory) {
                setListings(allListings)
                setSelectedCategory('')
                return
            }
            setSelectedCategory(category)
            if (category.trim() === '') {
                toast.error('Please enter a search term!');
                setListings(allListings)
                return;
            }



            const filtered = allListings.filter(l =>
                [l.title, l.location, l.country, l.type, l.location + l.country, l.weather].some(field =>
                    field.toLowerCase().split(/\s+/).includes(category.toLowerCase())
                ) //some aamathi koi ek pan match thay to return true thai jashe. .split words ne whitspace na according array ma convert kari dese and now aakha word mate check thase ex: ["hotel"].includes("hot") to false return thase without split true return thase
            );
        

            if (filtered.length === 0) {
                toast.error('No Property found!');
                setListings(allListings)
                setSelectedCategory('')
                return
            }
            setListings(filtered)
            setSelectedCategory(category)

        } catch (error) {
            toast.error('Invalid search!');
        }
    }

    const CategoryIcon = ({ icon, label }) => (
        <div
            onClick={() => handleClick(label)}
            className={`flex flex-col items-center cursor-pointer px-3 py-1 rounded-md transition-opacity ${selectedCategory === label ? 'bg-gray-300 opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
        >
            <FontAwesomeIcon icon={icon} />
            <p className="text-xs font-medium">{label}</p>
        </div>
    );


    useEffect(() => {
        getAllListings()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50  py-6">
            {/* Icon Section */}
            <div className="flex overflow-scroll mx-5 justify-evenly gap-6 mb-10 text-3xl">
                <CategoryIcon icon={faPersonSwimming} label="Pool" />
                <CategoryIcon icon={faCow} label="Farm" />
                <CategoryIcon icon={faMountain} label="Mountain" />
                <CategoryIcon icon={faTree} label="Forest" />
                <CategoryIcon icon={faFortAwesomeAlt} label="Palace" />
                <CategoryIcon icon={faHotel} label="Hotel" />
                <CategoryIcon icon={faTent} label="Tent" />
                <CategoryIcon icon={faWater} label="Waterfront" />
                <CategoryIcon icon={faSnowflake} label="Cold" />
                <CategoryIcon icon={faUmbrellaBeach} label="Beach" />
                <CategoryIcon icon={faCloudRain} label="Rainy" />
            </div>


            {/* Listings */}
            <div className="max-w-screen-xl mx-auto px-4 md:px-12">
                <div className="flex flex-wrap gap-12 justify-center items-center">
                    {
                        listings.map((item, index) => (
                            <div
                                onClick={() => navigate(`/showcard/${item._id}`)}
                                key={index}
                                className="cursor-pointer hover:opacity-90 w-full sm:w-[300px] bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 transition-transform hover:scale-105"
                            >
                                <img
                                    className="rounded-t-lg h-[200px] w-full object-cover"
                                    src={item.image.url}
                                    alt={item.title}
                                />
                                <div className="p-4">
                                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h5>
                                    <p className="text-gray-700 dark:text-gray-400">₹ {item.price}/night</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Home
