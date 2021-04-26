import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { SkynetClient } from 'skynet-js';
import { ContentRecordDAC } from '@skynetlabs/content-record-library';

// import components
import Home from './components/Home';
import ProposalForm from './components/ProposalForm';
import About from './components/About';
import Browse from './components/Browse';
import Courses from './components/Courses'
import Dashboard from './components/dashboard/Dashboard';
import IntroCourse from './components/IntroCourse';
import ProposeBoard from './components/ProposalBoard';
import Header from './components/layout/Header';
import EditCourse from './components/EditCourse';
import EditSection from './components/EditSection';
import Footer from './components/layout/Footer'

// import contract abis
import AGOToken from './build/contracts/AGOToken.json';
import Agorum from './build/contracts/Agorum.json';

function App() {
  const [web3js, setWeb3js] = useState(null);
  const [contracts, setContracts] = useState({agoToken: null, agorum: null});
  const [address, setAddress] = useState('');

  // skynet stuff
  const [skynetClient, setSkynetClient] = useState(null);
  const [mysky, setMySky] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [skynetID, setSkynetID] = useState('');
  const [proposalCount, setProposalCount] = useState(0);
  const [contentRecord, setDAC] = useState(null);

  // object passing in all skynet related objects
  const skynet = {
    skynetClient,
    mysky,
    loggedIn,
    skynetID,
    proposalCount,
    contentRecord,
    setLoggedIn,
    setSkynetID,
    setProposalCount,
  };

  // retrieves the user proposal count; if no proposals have been made by this user yet, initializes count to 0
  // and writes this to MySky
  useEffect(() => {
    // retrieves the current proposal count of the user
    async function getTotalProposalCount() {
      // this is the "global variable" of the proposal counts for each user
      const proposalCountPath = 'localhost/proposals/count';
      let count;

      // attempt to retrieve the proposalCount
      const { data } = await mysky.getJSON(proposalCountPath);

      // if the datapath has been set, then retrieve the current count
      // otherwise, initialize count to 0 and store it
      if (data) {
        count = data;
      } else {
        count = { proposalCount: 0 };
        await mysky.setJSON(proposalCountPath, count);
      }

      // set react state
      setProposalCount(count);
    }

    if (mysky) {
      getTotalProposalCount();
    }
  }, [mysky]);

  // initialize skynet client on component mount
  useEffect(() => {
    const client = new SkynetClient();
    setSkynetClient(client);
  }, [])

  // initialize mySky: decentralized identity provider
  // initialize DAC
  useEffect(() => {
    async function initMySky() {
      try {
        if (skynetClient) {
          const mySky = await skynetClient.loadMySky('localhost');
          setMySky(mySky);
          console.log('here')

          // create content record
          const contentRecord = new ContentRecordDAC();
          // load DACs
          await mySky.loadDacs(contentRecord);
          setDAC(contentRecord);

          // try to login silently
          const loggedIn = await mySky.checkLogin();

          if (loggedIn) {
            setLoggedIn(loggedIn);
            setSkynetID(await mySky.userID());
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    initMySky();
  }, [skynetClient, loggedIn]);

  /**
   * Load web3 provider from dapp browser and set it in component state
   */
  useEffect(() => {
    async function loadWeb3() {
      // modern dapp browser
      if(window.ethereum) {
        setWeb3js(new Web3(window.ethereum));
        try {
          await window.ethereum.enable();
        } catch (error) {
          // user denied account access
          window.alert('Please allow account access');
        }
        // legacy dapp browser
      } else if (window.web3) {
        setWeb3js(new Web3(window.web3.currentProvider))
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    loadWeb3();
  }, []);

  /**
   * Load in the smart contracts
   */
  useEffect(() => {
    async function loadContracts() {
      try {
        let agoToken = new web3js.eth.Contract(AGOToken.abi, AGOToken.networks[5777].address);
        let agorum = new web3js.eth.Contract(Agorum.abi, Agorum.networks[5777].address);

        // merge within the current state
        setContracts(prevState => {
          let newData = { ...prevState };
          newData['agoToken'] = agoToken;
          newData['agorum'] = agorum;
          return { ...prevState, ...newData };
        });
      } catch (error) {
        console.error(error)
      }
    }

    loadContracts();
  }, [web3js]);

  /**
   * Load user address
   */
  useEffect(() => {
    async function getAccount() {
      try {
        const address = await web3js.eth.getAccounts();
        setAddress(address[0]);
      } catch(error) {
        console.error(error);
      }
    }

    getAccount();
  }, [web3js]);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Header {...skynet} />
            <Dashboard web3={web3js} contracts={contracts} address={address} {...skynet} />
          </Route>

          <Route path="/introcourse">
            <Header {...skynet} />
            <IntroCourse contracts={contracts} address={address} />
          </Route>

          <Route path="/About">
            <Header {...skynet} />
            <About />
          </Route>

          <Route path="/browse">
            <Header {...skynet} />
            <Courses />
          </Route>

          <Route path="/proposals">
            <Header {...skynet} />
            <ProposeBoard />
          </Route>

          {/* <Route path="/agorum/:id" >
            <AgorumView />
          </Route> */}

          <Route path="/editcourse/:id">
            <Header {...skynet} />
            <EditSection />
          </Route>

          {/* <Route path="/editsection/:id">
            <Header {...skynet} />
            <EditSection />
          </Route> */}

          <Route path="/proposecourse">
            <Header {...skynet} />
            <ProposalForm {...skynet} />
          </Route>

          <Route exact path="/">
            <Header {...skynet} />
            <Home />
            <Footer />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
