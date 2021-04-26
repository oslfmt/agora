import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {
  const mysky = props.mysky;
  const setLoggedIn = props.setLoggedIn;
  const setSkynetID = props.setSkynetID;
  const setProposalCount = props.setProposalCount;

  const handleLogin = async () => {
    const status = await mysky.requestLoginAccess();
    setLoggedIn(status);

    if (status) {
      const id = await mysky.userID();
      setSkynetID(id);
    }
  }

  const handleLogout = async () => {
    // globally logout of mysky
    await mysky.logout();

    setLoggedIn(false);
    setSkynetID('');
    setProposalCount(0);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-color">
      <div className="container-fluid d-flex justify-content-end">
        <div className="navbar-nav">
          <Link className="nav-link nav-style" to="/">Home</Link>
          <Link className="nav-link" to="/proposals">Proposals</Link>
          <Link className="nav-link" to="/browse">Browse</Link>
          <Link className="nav-link" to="/about">About</Link>
          {props.loggedIn ?
            <Link className="nav-link" to="/dashboard">Dashboard</Link> :
            null
          }
          {props.loggedIn ?
            <Link className="nav-link" onClick={handleLogout} to="">Logout</Link> : 
            <Link className="nav-link" onClick={handleLogin} to="">Login</Link>
          }
        </div>
      </div>
    </nav>
  );
}

export default Header;