import React from 'react';
import './App.scss';
import {Router, Link} from '@reach/router';
import Layout from './layout/Layout';



//import pages
import About from './pages/About';
import Profile from './pages/Profile';
import ThinkpadSearch from './pages/ThinkpadSearch';


const App = () => {

  
  return (
    <Layout>
      <Link to="/about">About</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/thinkpad">ThinkpadSearch</Link>
          <Router>
              <About path="/about" />
              <Profile path="/profile" />
              <ThinkpadSearch path="/thinkpad" />
        </Router>
    </Layout>
  )
}

export default App

