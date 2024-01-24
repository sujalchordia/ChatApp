// Dashboard.js
import React from 'react';
import { useEffect,useState } from 'react';
import UserCard from './UserCard';
import Avatar from 'react-avatar';
import Chat from './MainChat';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import RightSidebar from './RightCard';
import ConversationCard from './ConversationCard';
import {io} from "socket.io-client"
// Import React and other necessary modules

const Dashboard = () => {
  
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [mainchatvisible,setmainChatvisible]=useState(false);
  const [mainChat, setmainChat] = useState({
    reciever_id: "",
    reciever_name: "",
    conversation_id: ""
  });
  const [Users, setUsers] = useState([]);
  const [activeUsers, setactiveUsers] = useState([]);
  const { id } = useParams();
  const[search,setSearch]=useState("");
  const userdetails = location.state.datareceived;
  const[socket,setSocket]=useState(null);


  const loadConversations = async (setOrder=true) => {
    try {
          let response = await fetch(`https://chatappwebservice.onrender.com/api/conversation/${id}`, {
            method: "GET",
            headers: {
              'Content-Type': "application/json",
            }
          });
          response = await response.json();
          setConversations(response);
          // if (setOrder && response.length > 0) {
          //   setmainChatvisible(true)
          //   setmainChat({
          //     reciever_id: response[0].user._id,
          //     reciever_name: response[0].user.name,
          //     conversation_id: response[0].conversationId
          //   });
          // }
        } catch (error) {
          console.error("Error loading conversations:", error);
        }
      }

    
  useEffect(() => {
    setSocket(io("http://localhost:8080"))
  }, []);

  useEffect(() => {
    socket?.emit("addUser",id)
    socket?.on('getUsers',users=>{
      setactiveUsers(users)
    })
    socket?.on('newConversation',()=>{
      loadConversations();
    })
  }, [socket]);


  // Load conversations on component mount
  useEffect(() => {
    loadUser()
    loadConversations();
  }, []);

  // useEffect(() => {
  //   loadConversations();
  // }, [mainChat]);


  
  const loadUser= async () => {
    try {
      let response = await fetch(`https://chatappwebservice.onrender.com/api/users`, {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
        }
      });
      response = await response.json();
      const usersWithoutCurrentUser = response.filter(user => user.user._id.toString() !== id);
      setUsers(usersWithoutCurrentUser);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  }

  useEffect(() => {
    loadUser();
    loadConversations();
  }, [id]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="lg:w-1/4 bg-gray-200 p-4 overflow-auto">
        <div className="bg-gray-200 p-4 max-w-xs mx-auto flex items-center">
        <div className="mr-4">
        {userdetails.image?.url ? (
          <img
            src={userdetails.image.url}
            alt="User Avatar"
            className="rounded-full w-16 h-16 object-cover"  // Adjust the max-width and max-height as needed// Ensures the image is contained within the specified dimensions
          />
        ) : (
          <Avatar name={userdetails.name} size="80" alt="User Avatar" className="w-16 h-16 rounded-full" />
        )}
      </div>
          {/* Avatar Image on the left */}
          {/* <div className="mr-4">
            <Avatar size="80" name={userdetails.name} alt="User Avatar" className="w-16 h-16 rounded-full" />
          </div> */}
          {/* Main Content on the right */}
          <div>
            {/* Person's Name */}
            <h2 className="text-xl font-bold text-gray-800">{userdetails.name}</h2>

            {/* Status */}
            <div className="flex items-center">
              <span className="text-xs text-black-20">Your Account</span>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {/* Map through conversations and render UserCard components */}
        {conversations.map(conversation => (
          <ConversationCard onClick={()=>{
            setmainChatvisible(true);
            setmainChat({
            ...mainChat,
            reciever_id:conversation.user.id,
            reciever_name:conversation.user.name,
            conversation_id:conversation.conversationId
          })}}key={conversation.conversationId} reciever_id={conversation.user.id} activeUsers=
          {activeUsers} name={conversation.user.name} status="Available" />
        ))}
      </div>

      {/* Middle Chat Area */}
      <div className="lg:w-3/6 p-4 pb-0  overflow-hidden ">
  {mainchatvisible? (
    <Chat
      socket={socket}
      loadConversations={loadConversations}
      reciever_id={mainChat.reciever_id}
      reciever_name={mainChat.reciever_name}
      conversation_id={mainChat.conversation_id}
      sender_id={id}
      mainChat={mainChat}
      setmainChat={setmainChat}
    />
  ) : (
    <div className="text-center">
    <p className="text-xl font-bold text-gray-700 mb-2">No Conversations yet</p>
    <p className="text-gray-500">Choose users from the right side to start a chat</p>
  </div>
  )}
</div>


      <div className="lg:w-1/4 bg-gray-200 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {/* Implement search functionality here */}
        <div className='pb-5'>
        <input
          type="text"
          placeholder="Search users..."
          className="p-2 border border-gray-300 w-[100%] shadow-lg rounded mb-4"
          onChange={(e) => { setSearch(e.target.value) }} 
        />
        </div>
         {/* Map through users and render UserCard components */}
         {Users.filter((user) => {
  if (user.user.name.toLowerCase().includes(search.toLocaleLowerCase())) {
    return true;
  }
}).map((user) => {
  const existingConversation = conversations.find((conversation) => {
    return conversation.user.id === user.user._id;
  });

  const conversationId = existingConversation
    ? existingConversation.conversationId
    : "";

  return (
    <ConversationCard
      onClick={() => {
        console.log("hiii")
        setmainChatvisible(true)
        setmainChat({
          ...mainChat,
          reciever_id: user.user._id,
          reciever_name: user.user.name,
          conversation_id: conversationId
        });
      }}
      name={user.user.name}
      reciever_id={user.user._id}
      activeUsers={activeUsers}
    />
  );
})}
      </div>
    </div>
  );
};

export default Dashboard;

