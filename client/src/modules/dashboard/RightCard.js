// Dashboard.js
import React from 'react';
import { useEffect,useState } from 'react';
import UserCard from './UserCard';
import Avatar from 'react-avatar';
import Chat from './MainChat';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';



const RightSidebar = ({ users,updateMainChat }) => {
    // You can implement search functionality here
    const [search, setSearch] = useState("");
    return (
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
        {users.filter((user)=>{
            if(user.user.name.toLowerCase().includes(search.toLocaleLowerCase())){
                return true;
            }
        }).map(user => (
          <UserCard
          onClick={() => updateMainChat(user.user._id, user.user.name)}
          name={user.user.name}
          status="Available" />
        ))}
      </div>
    );
  };

  export default RightSidebar;