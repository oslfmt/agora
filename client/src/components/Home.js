import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Trending from './Trending';
import { useAuth0 } from '@auth0/auth0-react';
import Header from './layout/Header';

function Home() {
  return (
    <section className="home">
      <Header />
      <div className="container">
        <div className="row">
          <h1 className="Agora_title">agora.</h1>
          <h2 className="lead mb-4">Good vibes for <i>thirsty</i> learners</h2>
          <SearchBar />
        </div>
        <div className="row">
          <Trending />
        </div>
      </div>
    </section>
  )
}

export default Home;