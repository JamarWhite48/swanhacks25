import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Message from './Components/Message.jsx'
import Navbar from './Components/Navbar.jsx'

function App() {

  return (
    <>
      <Navbar/>

      <div className='w-[75vw] min-h-[90vh] bg-white p-[50px] text-left mt-[40px]'>
        <h1 className='text-xl mb-[20px]'>Emergency Dashboard (#)</h1>
        <select className="border border-gray-300 p-[3px]" name='sort'>
          <option value="">Sort By</option>
          <option value="type">Type</option>
          <option value="location">Location</option>
          <option value="sender">Sender</option>
          <option value="status">Status</option>
          <option value="time">Date</option>
        </select>

        <div className="flex text-xs text-left mt-[30px] mb-[10px] justify-evenly">
          <div><p className="grow-1">Type</p></div>
          <div><p className="grow-1">Time</p></div>
          <div><p className="grow-1">Location</p></div>
          <div><p className="grow-1">Sender</p></div>
          <div><p className="grow-1">Status</p></div>
        </div>
        <hr/>

        <Message 
        type='Need' 
        time='9/12/25' 
        location='123 Main St. Iowa City, IA' 
        sender='712-676-4201' 
        status='Pending'></Message>

      </div>
    </>
  )
}

export default App
