import React from 'react'
import Avatar from 'react-avatar';


function UserCard({name,status}) {
  return (
    <div className="bg-gray-100 p-3 mb-3 rounded-md shadow-sm max-w-xs mx-auto flex items-center">
    {/* Avatar Image on the left */}
    <div className="mr-3 ">
      <Avatar name={name}size="50" alt="User Avatar" className=" rounded-full" />
    </div>

    {/* Main Content on the right */}
    <div>
      {/* Person's Name */}
      <h2 className="font-semibold text-lg  text-gray-800 mb-1">{name}</h2>

      {/* Status */}
      <div className="flex items-center">
        <span className="bg-green-500 w-2 h-2 rounded-full mr-1"></span> {/* Status Indicator */}
        <span className="text-green-500 text-xs">{status}</span>
      </div>
    </div>
  </div>
    
  )
}

export default UserCard
