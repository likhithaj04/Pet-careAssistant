import React from 'react';

export default function Header() {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',    
        color:'white',   
        fontWeight:'900',   
        fontSize:'26px'   
      }}
    >
      <h1>Pet Care Assistant</h1>
    </header>
  );
}
