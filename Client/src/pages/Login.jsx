import React, { useContext, useEffect, useState } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { ListContext } from '../Context/ListContext'

const Login = () => {
  const [state, setState] = useState('Login')
  const { backendUrl,token,setToken } = useContext(ListContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if(token){
      navigate('/')
    }
  },[token])

  async function submitHandler(e) {
    e.preventDefault()

    try {
      if (state == 'Sign up') {
        let { data } = await axios.post(backendUrl + '/user/register', { name, password, email })
        if (data.success) {
          setToken(data.token)
          toast.success('Welcome to BookNest!')
          localStorage.setItem('token', data.token)
          
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        let { data } = await axios.post(backendUrl + '/user/login', { password, email })
    
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          toast.success('login successful!')
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }



  }

  function changeState() {
    if (state === 'Sign up') {
      setState('Login')
    }
    else {
      setState('Sign up')
    }
  }

  function changeHandler(e) {
    if (e.target.name === 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else {
      setPassword(e.target.value)
    }
  }



  return (

    <form onSubmit={submitHandler} action="" className='flex flex-col gap-4 md:w-[400px] w-[350px] text-gray-600 border  border-gray-200 shadow m-auto  p-8 sm:mt-20 mt-10 text-sm rounded-lg'>
      <div className='flex flex-col gap-2 '>
        <p className='text-2xl font-semibold '>{state == 'Sign up' ? "Create Account" : "Login"}</p>
        <p>Please {state == 'Sign up' ? "sign up" : "login"} to book appointment</p>
      </div>

      <div className='flex flex-col gap-2 '>
        {state === 'Sign up' ? <div className='flex flex-col gap-2'>
          <label htmlFor="">Full Name</label>
          <input onChange={changeHandler} type="text" className='border border-gray-300 p-2 rounded-lg' name='name' value={name} />
        </div> : null}
        <div className='flex flex-col gap-2'>
          <label htmlFor="">Email</label>
          <input onChange={changeHandler} type="text" className='border border-gray-300 p-2 rounded-lg' name='email' value={email} />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="">Password</label>
          <input onChange={changeHandler} type="password" className='border border-gray-300 p-2 rounded-lg' name='password' value={password} />
        </div>
      </div>
      <button className='bg-blue-500 cursor-pointer text-white py-3 rounded-lg text-[16px] '>{state === 'Sign up' ? 'Create account' : "Login"}</button>


      {
        state === 'Sign up' ?
          <p>Already have an account? <span onClick={changeState} className='cursor-pointer underline text-blue-500'>Login here</span></p> :
          <p>Create an new account? <span onClick={changeState} className='cursor-pointer underline text-blue-500'>Click here</span></p>
      }
    </form>

  )
}

export default Login