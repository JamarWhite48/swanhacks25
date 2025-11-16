import { useState, useEffect } from "react";
import Message from "../Components/Message.jsx";
import Navbar from "../Components/Navbar.jsx";
import "../index.css";

// Firebase imports
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

// Helper: Parse Gemini analysis safely
function parseGeminiAnalysis(text) {
    if (!text || typeof text !== "string") return { type: "Unknown", location: "Unknown" };

    const lower = text.toLowerCase();
    const type = lower.includes("medical")
        ? "Medical"
        : lower.includes("fire")
            ? "Fire"
            : lower.includes("police")
                ? "Police"
                : "Need";

    const locationMatch = text.match(/at\s([^.,]+)/i);
    const location = locationMatch ? locationMatch[1] : "Unknown";

    return { type, location };
}

const Dashboard = () => {
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[Dashboard] Mounting, setting up Firebase RTDB listener");

        const alertsRef = ref(database, "alerts");

        const unsubscribe = onValue(
            alertsRef,
            (snapshot) => {
                console.log("[Dashboard] RTDB snapshot received");
                const data = snapshot.val();
                console.log("[Dashboard] Raw snapshot data:", data);

                const loadedMessages = [];

                if (data) {
                    for (const key in data) {
                        const alert = data[key];
                        const parsed = parseGeminiAnalysis(alert.analysis);

                        loadedMessages.push({
                            id: key,
                            sender: alert.from || "Unknown",
                            messageBody: alert.message || "",
                            time: new Date(alert.timestamp).toLocaleTimeString(),
                            date: new Date(alert.timestamp).toLocaleDateString(),
                            type: parsed.type,
                            location: parsed.location,
                            status: "Pending",
                        });
                    }
                }

                loadedMessages.reverse();
                console.log("[Dashboard] Processed messages:", loadedMessages);

                setMessageList(loadedMessages);
                setLoading(false);
            },
            (err) => {
                console.error("[Dashboard] Firebase read error:", err);
                setLoading(false);
            }
        );

        return () => {
            console.log("[Dashboard] Unmounting, removing Firebase listener");
            unsubscribe();
        };
    }, []);

    // Handler for replies (just logs for now)
    const handleReply = (reply) => {
        console.log("[Dashboard] Reply triggered:", reply);
        // You can call your /sendSMS endpoint here
    };

    return (
        <>
            <Navbar />

            <div className="flex justify-center">
                <div className="w-[85vw] min-h-[90vh] p-[50px] text-left mt-[60px]">
                    <h1 className="text-2xl mb-[20px] text-white font-bold">
                        Emergency Dashboard ({messageList.length})
                    </h1>

                    <select name="sort">
                        <option value="">Sort By</option>
                        <option value="type">Type</option>
                        <option value="location">Location</option>
                        <option value="sender">Sender</option>
                        <option value="status">Status</option>
                        <option value="time">Date</option>
                    </select>

                    <div className="flex text-xs text-white text-left mt-[30px] mb-[10px] justify-evenly text-[0.9rem] gap-[5px]">
                        <div className="w-[100%] shrink-[1.1]"><p>Type</p></div>
                        <div className="w-[100%]"><p>Location</p></div>
                        <div className="w-[100%]"><p>Sender</p></div>
                        <div className="w-[100%]"><p>Status</p></div>
                        <div className="w-[100%]"><p>Time</p></div>
                        <div className="w-[100%] shrink-[1.1]"><p></p></div>
                    </div>

                    <hr />

                    {loading ? (
                        <p className="text-white mt-4">Loading messages...</p>
                    ) : (
                        messageList.map((item) => (
                            <Message
                                key={item.id}
                                type={item.type}
                                time={item.time}
                                location={item.location}
                                sender={item.sender}
                                status={item.status}
                                messageBody={item.messageBody}
                                onReply={handleReply}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
