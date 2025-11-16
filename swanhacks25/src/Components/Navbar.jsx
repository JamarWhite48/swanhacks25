import React from "react";

function Navbar(){
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">Dispatcher</a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;