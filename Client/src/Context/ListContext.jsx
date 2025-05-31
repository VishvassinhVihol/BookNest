import React, { createContext, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export const ListContext = createContext()

const ListContextProvider = ({children}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token,setToken] = useState(localStorage.getItem('token') || '')

    const [listings,setListings] = useState([])

    const getAllListings = async ()=> {
        try {
            let {data} = await axios.get(backendUrl + '/api')
            if(data.success){
                setListings(data.allListings)
         
                
            }
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {listings,setListings,getAllListings,backendUrl,token,setToken}
  return (
    <ListContext.Provider value={value}>
        {children}
    </ListContext.Provider>
  )
}

export default ListContextProvider