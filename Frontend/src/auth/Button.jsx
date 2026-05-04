
import React from 'react';
import './Button.css';

export default function Button({ onClick, type = "button", children }) {
  return (
    <button className="ui_button" onClick={onClick} type={type}>
      {children}
    </button>
  );
}
