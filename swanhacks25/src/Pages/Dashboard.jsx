import Message from '../Components/Message.jsx'
import Navbar from '../Components/Navbar.jsx'
import {useState, useEffect} from 'react'
import "../index.css"

// Firebase Imports
import { database } from '../firebase' 
import { ref, onValue } from "firebase/database"

const Dashboard = () => {

    const [messageList, setMessageList] = useState([
        {key: 0, type:'Need', time:'9/12/25', location:'123 Main St. Iowa City, IA', sender:'712-676-4201', status:'Pending'},
        {key: 1, type:'Fire', time:'9/16/27', location:'999 hello St. Iowa City, IA', sender:'712-444-1234', status:'Completed'}])
    const [sortBy, setSortBy] = useState("")
    const [loading, setLoading] = useState(true)

    // Function to compare two emergency objects based on the 'key' (sortBy)
    const sortMessages = (a, b) => {
        if (!sortBy) return 0;

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string') {
            return aValue.localeCompare(bValue);
        }

        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
    };

    const sortedList = sortBy 
        ? messageList.slice().sort(sortMessages) 
        : messageList;

    const handleComplete = (id) => {
    setMessageList(prev =>
        prev.map(m =>
                m.id === id ? { ...m, status: "Completed" } : m
            )
        );
    };

    useEffect(() => {
      const alertsRef = ref(database, 'alerts');

      const unsubscribe = onValue(alertsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedMessages = [];

        if (data) {
          for (const key in data) {
            const alert = data[key];
            const parsedData = parseGeminiAnalysis(alert.analysis);

            loadedMessages.push({
              id: key,
              sender: alert.from,
              time: new Date(alert.timestamp).toLocaleTimeString(),
              date: new Date(alert.timestamp).toLocaleDateString(),
              messageBody: alert.message,
              type: parsedData.type || 'Unknown Type',
              location: parsedData.location || 'Unknown Location',
              status: 'Pending',
            });
          }
        }

        setMessageList(loadedMessages.reverse());
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

  return (
    <>
      <Navbar/>

        <div className='flex justify-center'>

      <div className='w-[85vw] min-h-[90vh] p-[2%] text-left mt-[60px]'>
        <h1 className='text-2xl mb-[20px] text-white font-bold'>Emergency Dashboard ({messageList.length})</h1>
        <select name='sort' onChange={(e) => setSortBy(e.target.value)}>
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
          <div className='w-[100%] shrink-[1.2]'></div>
          <div className='w-[100%] shrink-[1.1]'><p></p></div>
        </div>
        <hr/>

        {messageList.map((item, index) => {
            return(<Message 
                key={item.id}
                type={item.type}
                time={item.time}
                location={item.location}
                sender={item.sender}
                status={item.status}
                onComplete={() => handleComplete(item.key)}
            />)
        })}
      </div>
      
    </div>
    </>
  )
}

export default Dashboard