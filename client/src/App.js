import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Web3 from 'web3';

// import components
import Home from './components/Home';
import Proposals from './components/Proposals';
import About from './components/About';
import Browse from './components/Browse';
import Courses from './components/Courses'
import Dashboard from './components/dashboard/Dashboard';
import IntroCourse from './components/IntroCourse';
import ProposeBoard from './components/ProposalBoard';
import Header from './components/layout/Header';
import EditCourse from './components/EditCourse';
import EditSection from './components/EditSection';

// import contract abis
import AGOToken from './build/contracts/AGOToken.json';
import Agorum from './build/contracts/Agorum.json';

function App() {
  const [web3js, setWeb3js] = useState(null);
  const [contracts, setContracts] = useState({agoToken: null, agorum: null});
  const [address, setAddress] = useState('');


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
          <Route path="/Dashboard">
            <Dashboard web3={web3js} contracts={contracts} address={address} />
          </Route>

          <Route path="/introcourse">
            <Header />
            <IntroCourse contracts={contracts} address={address} />
          </Route>

          <Route path = "/About">
            <About />
          </Route>
          <Route path = "/Browse">
            <Courses />
          </Route>

          <Route path="/proposals">
            <Header />
            <ProposeBoard />
          </Route>

          {/* <Route path="/agorum/:id" >
            <AgorumView />
          </Route> */}

          <Route path="/editcourse/:id">
            <Header />
            <EditCourse />
          </Route>

          <Route path="/editsection/:id">
            <Header />
            <EditSection />
          </Route>

          <Route path="/proposecourse">
            <Header />
            <Proposals />
          </Route>

          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
