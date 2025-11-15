import React from "react";

function Navbar(){
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">App</a>
      </div>

      <div className="navbar-center">
        <ul className="nav-links">
          <li><a href="/products">Home</a></li>
          <li><a href="/about">Dashboard</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <a href="/cart" className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">0</span>
        </a>
        <a href="/account" className="user-icon">
          <i className="fas fa-user"></i>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;