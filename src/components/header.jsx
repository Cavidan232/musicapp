import React from 'react';
import "../css/header.css";
import { 
  FaHome, 
  FaMusic, 
  FaFilm,
  FaVolumeUp,
  FaRobot,
  FaPhotoVideo,
  FaLayerGroup,
  FaPalette,
  FaTools
} from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';

function Header() {
  const navLinks = [
    { name: "Home", path: "#", icon: <FaHome /> },
    { name: "Music", path: "#", icon: <FaMusic /> },
    { name: "Footage", path: "#", icon: <FaFilm /> },
    { name: "Sound Effects", path: "#", icon: <FaVolumeUp /> },
    { name: "AI Voiceover", path: "#", icon: <FaRobot /> },
    { name: "AI Image & Video", path: "#", icon: <FaPhotoVideo />},
    { name: "Templates", path: "#", icon: <FaLayerGroup /> },
    { name: "LUTs", path: "#", icon: <FaPalette /> },
    { name: "Tools", path: "#", icon: <FaTools /> }
  ];

  return (
    <header className='header'>
      <div className="header-container">
        <span className='artlist'>Artlist</span>
        
        <nav className="nav-links">
          {navLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.path} 
              className="nav-link"
            >
              <span className="icon">{link.icon}</span>
              <span className="text">{link.name}</span>
             
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;