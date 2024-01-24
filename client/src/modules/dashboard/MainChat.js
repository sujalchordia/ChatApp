// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import Avatar from 'react-avatar';


const Chat = ({
  reciever_id,
  reciever_name,
  conversation_id,
  sender_id,
  loadConversations,
  socket,
  mainChat,
  setmainChat
}) => {
  console.log("current conversation",mainChat.conversation_id)
  const cid=useRef(mainChat.conversation_id);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const[user,setUser]=useState({})
  useEffect(() => {
    cid.current = mainChat.conversation_id || null;
  }, [mainChat.conversation_id]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://chatappwebservice.onrender.com/api/users/${reciever_id}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [reciever_id]);

  useEffect(() => {
    loadMessages();
  }, [conversation_id]);
  useEffect(() => {
    socket?.on("getMessage", data => {
      console.log(data,"   ",cid.current);
      if(cid.current === data.conversationId){
        console.log("REACHED SOCKET")
        setMessages(prev => [...prev, { user: data.user, message: data.message }]);
      }
    });
  }, [socket]); // Add mainChat to the dependency arra


  
const makeConversationId = async (sender_id, reciever_id,reciever_name,setmainChat) => {
  let response = await fetch(`https://chatappwebservice.onrender.com/api/conversation`, {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
    },
    body: JSON.stringify({
      senderid: sender_id,
      recieverid: reciever_id,   
    })
  });
  const id = await response.json();
  socket.emit('newConversation', {
    reciever_id,
  });
  loadConversations(false)
  setmainChat({
    reciever_id: reciever_id,
    reciever_name: reciever_name,
    conversation_id: id
  })
  console.log("conversation id created:", id)
  return id;
}


  const loadMessages = async () => {

    try {
      let response = await fetch(`https://chatappwebservice.onrender.com/api/messages/${conversation_id?conversation_id:"new"}`, {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
        }
      });
      response = await response.json();
      setMessages(response);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };
  useEffect(() => {
    loadMessages();
  }, [conversation_id,reciever_id]);

  const handleSubmit = async (e) => {
    console.log(reciever_id)
    e.preventDefault();
    const final_conversation_id = conversation_id ? conversation_id:await makeConversationId(sender_id, reciever_id,reciever_name,setmainChat)
    try {
      socket?.emit("sendMessage",{
        senderid: sender_id,
        recieverid: reciever_id,
        conversationId: final_conversation_id,
        message: inputMessage
      })
      let response = await fetch(`https://chatappwebservice.onrender.com/api/messages`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          senderid: sender_id,
          recieverid: reciever_id,
          conversationId: final_conversation_id,
          message: inputMessage
        })
      });
      response = await response.json();
      setInputMessage("");
      // loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <div  className="flex flex-col h-screen bg-gray-100 ">
      {/* Chat Header */}
      <div className="inline-flex bg-gray-200 p-2 mb-2 rounded-lg">
        {user.image?.url ? (
          <img
            src={user.image.url}
            alt="User Avatar"
            className="rounded-full w-16 h-16 object-cover mr-3"  // Adjust the max-width and max-height as needed// Ensures the image is contained within the specified dimensions
          />
        ) : (
          <Avatar name={reciever_name} size="35" alt="User Avatar" className="rounded-full mr-3" />
        )}
        <span className="text-xl font-bold pt-4">{reciever_name}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto bg-gray-100 max-h-[76%] p-4 rounded-lg shadow-md">
        {messages.map((message, index) => (
          <div key={index} className={message.user._id!== sender_id ? "flex items-start mb-4" : "flex items-end justify-end mb-4"}>
            <div className={message.user._id !== sender_id ? "bg-gray-300 max-w-[50%] p-3 rounded-lg" : "bg-blue-500 max-w-[50%] p-3 rounded-lg"}>
              <p className={message.user._id !== sender_id ? "text-gray-800" : "text-white"}>{message.message}</p>
            </div>
          </div>
        ))}
         <div className="invisible"ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit}>
        <div className="flex m-2 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 rounded-l-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type='submit' className="bg-blue-500 text-white p-3 rounded-r-md focus:outline-none">
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
