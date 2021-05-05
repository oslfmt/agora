import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-color">
      <div className="container-fluid d-flex justify-content-end">
        <div className="navbar-nav">
          <Link className="nav-link nav-style" to="/">Home</Link>
          <Link className="nav-link" to="/proposals">Proposals</Link>
          <Link className="nav-link" to="/browse">Browse</Link>
          <Link className="nav-link" to="/about">About</Link>
          {true?
            <Link className="nav-link" to="/dashboard">Dashboard</Link> :
            null
          }
          {true?
            <Link className="nav-link" to="">Logout</Link> : 
            <Link className="nav-link" to="">Login</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default Header;