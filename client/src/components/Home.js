import React, {useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkynetClient } from 'skynet-js';

// import components
import SearchBar from './SearchBar';
import Trending from './Trending';
import Header from './layout/Header';

function Home() {
  const [skynetClient, setSkynetClient] = useState(null);

  // initialize skynet client on component mount
  useEffect(() => {
    const client = new SkynetClient('https://siasky.net/');
    setSkynetClient(client);
  }, [])

  // initialize mySky
  useEffect(() => {
    async function initMySky() {
      try {
        console.log(skynetClient);

        if (skynetClient) {
          const mySky = await skynetClient.loadMySky('localhost');
          console.log('here')
  
          // try to login silently
          const loggedIn = await mySky.checkLogin();
          console.log(loggedIn);
        }
      } catch (err) {
        console.error(err);
      }
    }

    initMySky();
  }, [skynetClient]);

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