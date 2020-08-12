import React from 'react';
import './styles.css';
import logo from './logo.svg';

const Header = () => {
  return (
    <div className="header">
      <img className="header_logo" src={logo} alt="RBG Digital Ltd. Logo" />
      <h1 className="header_title">Parrot Mini-Drone Controller</h1>
      <p className="header_info">
        UI for controlling a Parrot Mini-Drone. Either click on elements below or use keyboard. 
      </p>
      <p className="header_info header_info-small">
        <strong>Keys -</strong> Take-Off/ Land: T | Move: Arrows | Raise: W | Lower: S | Turn Left: A | Turn Right: D | Flatten: F | Emergency Stop: Esc
      </p>
    </div>
  );
};

export default Header;
