import Message from '../Components/Message.jsx'
import Navbar from '../Components/Navbar.jsx'
import {useState} from 'react'
import "../index.css"

const Dashboard = () => {
  
  const [messageList, setMessageList] = useState([])

  return (
    <>
      <Navbar/>

      <div className='w-[85vw] min-h-[90vh] bg-white p-[50px] text-left mt-[40px]'>
        <h1 className='text-xl mb-[20px]'>Emergency Dashboard (#)</h1>
        <select className="border border-gray-300 p-[3px]" name='sort'>
          <option value="">Sort By</option>
          <option value="type">Type</option>
          <option value="location">Location</option>
          <option value="sender">Sender</option>
          <option value="status">Status</option>
          <option value="time">Date</option>
        </select>

        <div className="flex text-xs text-left mt-[50px] mb-[10px] justify-evenly text-[0.9rem] gap-[5px]">
          <div className='w-[100%] shrink-[1.1]'><p>Type</p></div>
          <div className='w-[100%]'><p>Location</p></div>
          <div className='w-[100%]'><p>Sender</p></div>
          <div className='w-[100%]'><p>Status</p></div>
          <div className='w-[100%]'><p>Time</p></div>
          <div className='w-[100%] shrink-[1.1]'><p></p></div>
        </div>
        <hr className='topLine'/>

        <Message 
        type='Need' 
        time='9/12/25' 
        location='123 Main St. Iowa City, IA'
        sender='712-676-4201' 
        status='Pending'></Message>

        <Message 
        type='Need' 
        time='9/12/25' 
        location='67 Diddyblud way Cincinatti, OH' 
        sender='712-676-4201' 
        status='Completed'></Message>

      </div>
    </>
  )
}

export default Dashboard