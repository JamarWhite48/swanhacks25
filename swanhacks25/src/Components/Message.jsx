import { useState } from "react";
import check from '../assets/check.png'

function Message(props) {
  
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const handleSend = () => {
    if (!replyText.trim()) {
      setToastType("error");
      setToastMessage("Please fill out the required fields.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Call parent reply handler (Dashboard)
    if (onReply) {
      onReply({
        phoneNumber: sender,
        message: replyText,
      });
    }

    setReplyText("");
    setOpen(false);

    setToastType("success");
    setToastMessage("Message sent successfully!");
    setShowToast(true);

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <div className="flex text-xs text-[#d3d2d6] font-thin mt-[30px] mb-[10px] justify-evenly items-center gap-[5px]">
        <div className="w-[100%] shrink-[1.1]"><p>{props.type}</p></div>
        <div className="w-[100%]"><p>{props.location}</p></div>
        <div className="w-[100%]"><p>{props.sender}</p></div>
        <div className={`w-[100%] 
        ${props.status === "Pending" ? "text-yellow-500 font-bold" 
        : props.status === "Completed" ? "text-green-500 font-bold" 
        : "text-gray-500"}`}>
        <p>{props.status}</p></div>
        <div className="w-[100%]"><p>{props.time}</p></div>

        <div className='w-[100%] shrink-[1.2]'>
          {props.status != "Completed" && <button className='w-[20px]' onClick={() => props.onComplete()}><img src={check}></img></button>}
        </div>

          <div className="w-[100%] shrink-[1.1]">
            <button
                onClick={() => setOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reply
            </button>
          </div>
        </div>

        <hr />

        {/* Reply Modal */}
        {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white p-6 rounded shadow-lg w-[350px]">

                <h2 className="text-lg mb-2 font-semibold">
                  Reply to {sender}
                </h2>

                {messageBody && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Original:</strong> {messageBody}
                    </p>
                )}

                <textarea
                    className="border w-full p-2 rounded mb-4"
                    rows={4}
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                      onClick={() => setOpen(false)}
                      className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>

                  <button
                      onClick={handleSend}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Send
                  </button>
                </div>

              </div>
            </div>
        )}

        {/* Toast Notification */}
        {showToast && (
            <div
                className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg animate-fadeIn ${
                    toastType === "success"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                }`}
            >
              {toastMessage}
            </div>
        )}
      </>
  );
}

export default Message;
