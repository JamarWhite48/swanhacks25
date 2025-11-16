import Message from '../Components/Message.jsx'
import Navbar from '../Components/Navbar.jsx'
import {useState} from 'react'
import "../index.css"
import {database} from "../../firebase.json"
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

const Dashboard = () => {
  
  const [messageList, setMessageList] = useState([{key: 0, type:'Need', time:'9/12/25', location:'123 Main St. Iowa City, IA', sender:'712-676-4201', status:'Pending'}])

  return (
    <>
      <Navbar/>

        <div className='flex justify-center'>

      <div className='w-[85vw] min-h-[90vh] p-[50px] text-left mt-[60px]'>
        <h1 className='text-2xl mb-[20px] text-white font-bold'>Emergency Dashboard ({messageList.length})</h1>
        <select name='sort'>
          <option value="">Sort By</option>
          <option value="type">Type</option>
          <option value="location">Location</option>
          <option value="sender">Sender</option>
          <option value="status">Status</option>
          <option value="time">Date</option>
        </select>

        <div className="flex text-xs text-white text-left mt-[30px] mb-[10px] justify-evenly text-[0.9rem] gap-[5px]">
          <div className='w-[100%] shrink-[1.1]'><p>Type</p></div>
          <div className='w-[100%]'><p>Location</p></div>
          <div className='w-[100%]'><p>Sender</p></div>
          <div className='w-[100%]'><p>Status</p></div>
          <div className='w-[100%]'><p>Time</p></div>
          <div className='w-[100%] shrink-[1.1]'><p></p></div>
        </div>
        <hr/>

        {messageList.map((item, index) => {
            return(<Message 
                type={item.type}
                time={item.time}
                location={item.location}
                sender={item.sender}
                status={item.status}
            />)
        })}
      </div>

        

      </div>

      <div className="w-full h-[60vh] rounded-lg overflow-hidden shadow-xl">
      
    </div>
    </>
  )
}

export default Dashboard