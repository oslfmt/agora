import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Trending from './Trending';
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
  return (
    <section className="home">

      <HomeNavbar />
      <div className="container">
        <div className="row">
          <h1 className="Agora_title">agora.</h1>
          <SearchBar />
        </div>
        <div className="row">
          <Trending />
        </div>
      </div>
    </section>
  )
}

const HomeNavbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-color">
      <div className="container-fluid">
        <div className="navbar-nav">
          <Link className="nav-link nav-style" to="/">Home</Link>
          <Link className="nav-link" to="/proposals">Proposals</Link>
          <Link className="nav-link" to="/browse">Browse</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          
        </div>
      </div>
    </nav>
  );
}

export default Home;