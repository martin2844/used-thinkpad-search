import React from 'react';
import './App.scss';
import {Router} from '@reach/router';
import Layout from './layout/Layout';



//import pages
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import ThinkpadSearch from './pages/ThinkpadSearch';
import Search from './pages/Search';


const App = () => {

  
  return (
    <Layout>
          <Router>
              <Home path="/"/>
              <Search path="/search" />
              <About path="/about" />
              <Profile path="/profile" />
              <ThinkpadSearch path="/thinkpads" />
        </Router>
    </Layout>
  )
}

export default App

