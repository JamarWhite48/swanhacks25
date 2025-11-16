import Message from '../Components/Message.jsx';
import Navbar from '../Components/Navbar.jsx';
import { useState, useEffect } from 'react';
import "../index.css";

// Firebase Imports
import { database } from '../firebase';
import { ref, onValue } from "firebase/database";

// Parse message for demo (Type + Location)
function parseMessage(message) {
    let type = "Need";
    let location = "Unknown";

    // Extract location if message contains "Location: ..."
    const locMatch = message.match(/Location:\s*(.*)/i);
    if (locMatch && locMatch[1]) location = locMatch[1].trim();

    // Detect type from keywords
    if (/fire/i.test(message)) type = "Fire";
    else if (/police/i.test(message)) type = "Police";
    else if (/medical|help/i.test(message)) type = "Need";

    return { type, location };
}

const Dashboard = () => {
    const [messageList, setMessageList] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [loading, setLoading] = useState(true);

    const sortMessages = (a, b) => {
        if (!sortBy) return 0;
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (typeof aValue === 'string') return aValue.localeCompare(bValue);
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    };

    const sortedList = sortBy ? messageList.slice().sort(sortMessages) : messageList;

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
                    const parsedData = parseMessage(alert.message);

                    loadedMessages.push({
                        id: key,
                        sender: alert.from,
                        time: new Date(alert.timestamp).toLocaleTimeString(),
                        date: new Date(alert.timestamp).toLocaleDateString(),
                        messageBody: alert.message,
                        type: parsedData.type,
                        location: parsedData.location,
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
            <Navbar />

            <div className='flex justify-center'>
                <div className='w-[85vw] min-h-[90vh] p-[2%] text-left mt-[60px]'>
                    <h1 className='text-2xl mb-[20px] text-white font-bold'>
                        Emergency Dashboard ({messageList.length})
                    </h1>

                    <select name='sort' onChange={(e) => setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="type">Type</option>
                        <option value="location">Location</option>
                        <option value="sender">Sender</option>
                        <option value="status">Status</option>
                        <option value="time">Time</option>
                    </select>

                    <div className="flex text-xs text-white text-left mt-[30px] mb-[10px] justify-evenly text-[0.9rem] gap-[5px]">
                        <div className='w-[100%] shrink-[1.1]'><p>Type</p></div>
                        <div className='w-[100%]'><p>Location</p></div>
                        <div className='w-[100%]'><p>Sender</p></div>
                        <div className='w-[100%]'><p>Status</p></div>
                        <div className='w-[100%]'><p>Time</p></div>
                        <div className='w-[100%] shrink-[1.1]'><p>Message</p></div>
                        <div className='w-[100%] shrink-[1.1]'></div>
                    </div>
                    <hr />

                    {loading ? (
                        <p className="text-white mt-4">Loading messages...</p>
                    ) : messageList.length === 0 ? (
                        <p className="text-white mt-4">No messages yet.</p>
                    ) : (
                        sortedList.map((item) => (
                            <Message
                                key={item.id}
                                type={item.type}
                                time={item.time}
                                location={item.location}
                                sender={item.sender}
                                status={item.status}
                                messageBody={item.messageBody}
                                onComplete={() => handleComplete(item.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
