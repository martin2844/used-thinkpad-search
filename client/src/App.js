import React from 'react';
import './App.scss';
import {Router} from '@reach/router';
import Layout from './layout/Layout';



//import pages
import About from './pages/About';
import Profile from './pages/Profile';
import ThinkpadSearch from './pages/ThinkpadSearch';


const App = () => {

  
  return (
    <Layout>
          <Router>
              <About path="/about" />
              <Profile path="/profile" />
              <ThinkpadSearch path="/thinkpads" />
        </Router>
    </Layout>
  )
}

export default App

