import React from 'react';

// import components
import SearchBar from './SearchBar';
import Trending from './Trending';

function Home() {
  return (
    <section className="home">
      <div className="container-fluid">
        <div className="row">
          <h1 className="Agora_title">agora.</h1>
          <h2 className="lead mb-4">Good vibes for <i>thirsty</i> learners</h2>
          <SearchBar />
        </div>
        <div className="row">
          <Trending />
        </div>
        <div className="row bg-light p-4 d-flex justify-content-center">
          <div className="col-8">
            <h2 className="h2">About</h2>
            <p className="lead">Agora is a community-driven education platform, that seeks to create a community of learners that work together to make an engaging learning community.</p>
            <blockquote class="blockquote quote">
              <p>Agora is derived from the Greek term ageirein, which means “to gather together,” and is roughly translated as “assembly” or “assembly place.”</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home;