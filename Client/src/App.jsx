import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Home from './pages/Home'
import { ToastContainer, toast } from 'react-toastify';
import NewProperty from './pages/NewProperty';
import ShowCard from './pages/ShowCard';
import Login from './pages/Login';
import About from './Components/About';

const App = () => {
  return (
    <div >
      <Navbar/>
      <ToastContainer/>
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/add-newproperty' element ={<NewProperty/>}/>
        <Route path='/showcard/:id' element ={<ShowCard/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='*' element={<h1 className='text-3xl text-center mt-10'>Page Not Found</h1>}/>
        

      </Routes>
    </div>
  )
}

export default App