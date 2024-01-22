import React from 'react';

const Button = ({ 
    label, 
    type,
    className,
    disabled }) => {
  
  return (
<button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 
px-4 rounded ${className}`} disabled={disabled} type={type}>
 {label}
</button>
  );
};

export default Button;
