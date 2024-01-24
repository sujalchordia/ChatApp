import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { useParams } from 'react-router-dom';

function ConversationCard({ onClick, name, activeUsers, reciever_id }) {
  const [status, setStatus] = useState("Offline");
  const [user, setUser] = useState({});
  const { id } = useParams();

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
    const isUserActive = activeUsers.find((user) => user.userId === reciever_id);
    const userStatus = isUserActive ? isUserActive.status : 'Offline';
    setStatus(userStatus);
  }, [activeUsers, id, reciever_id]);

  return (
    <div onClick={onClick} className="bg-gray-100 p-3 mb-3 rounded-md shadow-sm max-w-xs mx-auto flex items-center">
      {/* Avatar Image on the left */}
      <div className="mr-3 ">
        {user.image?.url ? (
          <img
            src={user.image.url}
            alt="User Avatar"
            className="rounded-full w-16 h-16 object-cover"  // Adjust the max-width and max-height as needed// Ensures the image is contained within the specified dimensions
          />
        ) : (
          <Avatar name={name} size="50" alt="User Avatar" className="rounded-full" />
        )}
      </div>

      {/* Main Content on the right */}
      <div>
        {/* Person's Name */}
        <h2 className="font-semibold text-lg text-gray-800 mb-1">{name}</h2>

        {/* Status */}
        {status === "Online" ? (
          <div className="flex items-center">
            <span className="bg-green-500 w-2 h-2 rounded-full mr-1"></span> {/* Status Indicator */}
            <span className="text-green-500 text-xs">{status}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="bg-gray-500 w-2 h-2 rounded-full mr-1"></span> {/* Status Indicator */}
            <span className="text-gray-500 text-xs">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationCard;
