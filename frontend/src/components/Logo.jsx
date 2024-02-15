import React from 'react';
import logoImage from "../assets/Logo.png"

const Logo = () => {
  return (
    <div className="logo">
      <img src={logoImage} alt="Logo" className="w-40 h-30 object-contain" />
    </div>
  );
};

export default Logo;