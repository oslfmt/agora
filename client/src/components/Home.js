import React from 'react';

// import components
import SearchBar from './SearchBar';
import Trending from './Trending';
import Header from './layout/Header';

function Home(props) {
  return (
    <section className="home">
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